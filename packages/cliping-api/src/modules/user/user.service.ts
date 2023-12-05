import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { GraphQLError } from 'graphql';
import { DataSource, Repository } from 'typeorm';

import { Follower } from '@/entities/follower.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { User } from '@/entities/user.entity';
import { AuthProvider } from '@/enums/auth-provider.enum';
import { GqlErrorCode } from '@/enums/error.enum';
import { FirebaseService } from '@/modules/firebase/firebase.service';
import { FirebaseUser } from '@/modules/firebase/types/user.interface';

import { UserProjection } from './types/user-projection.interface';
import { Follow } from './vo/follow.vo';
import { FollowPagination } from './vo/follow-pagination.vo';
import { Me } from './vo/me.vo';
import { UpdateProfileInput } from './vo/update-profile-input.vo';
import { UpdateProfilePayload } from './vo/update-profile-payload.vo';
import { User as UserVO } from './vo/user.vo';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {}

  async getMe(user: FirebaseUser): Promise<Me> {
    const dbUser = await this.userRepository.findOneBy({ id: user.uid });
    return {
      name: user.name,
      email: user.email,
      userId: user.uid,
      providers: dbUser.provider.split(',') as AuthProvider[],
    };
  }

  async getUser(id: string): Promise<UserVO> {
    try {
      await this.firebaseService.getAuth().getUser(id);
    } catch {
      throw new GraphQLError('해당하는 유저가 없습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    const [user] = await this.dataSource.query<UserProjection[]>(
      `
SELECT
u.id,
p.nick_name AS nickName,
u.created_at AS createdAt,
p.description,
p.sub_title AS subTitle,
p.background_image_url AS backgroundImageUrl,
p.profile_image_url AS profileImageUrl,
p.instagram_url AS instagramUrl
FROM user u
LEFT JOIN profile p
ON u.id = p.user_id
WHERE u.id = ?;
    `,
      [id],
    );

    if (!user) {
      throw new GraphQLError('해당하는 유저가 없습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    const followers = await this.followerRepository
      .createQueryBuilder()
      .where('from_user_id = :id', { id })
      .orWhere('to_user_id = :id', { id })
      .getMany();

    const [followerCount, followingCount] = followers.reduce(
      (result, follower) =>
        follower.toUserId === id
          ? [result[0] + 1, result[1]]
          : [result[0], result[1] + 1],
      [0, 0],
    );

    return {
      id,
      nickName: user.nickName,
      createdAt: dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      profile: {
        description: user.description,
        subTitle: user.subTitle,
        backgroundImageUrl: user.backgroundImageUrl,
        profileImageUrl: user.profileImageUrl,
        instagramUrl: user.instagramUrl,
      },
      followerCount,
      followingCount,
      reviewCount: await this.reviewRepository.countBy({ userId: id }),
    };
  }

  async getFollowerList(
    user: FirebaseUser,
    limit: number,
    offset: number,
  ): Promise<FollowPagination> {
    const list = await this.dataSource.query<Follow[]>(
      `
SELECT
  p.user_id AS id,
  p.nick_name AS nickName,
  p.profile_image_url AS profileImageUrl
FROM profile p
JOIN follower f
ON p.user_id = f.to_user_id
WHERE f.from_user_id = ?
LIMIT ? OFFSET ?;
    `,
      [user.uid, limit, offset],
    );

    return {
      limit,
      offset,
      total: await this.followerRepository.countBy({ toUserId: user.uid }),
      list,
    };
  }

  async getFollowingList(
    user: FirebaseUser,
    limit: number,
    offset: number,
  ): Promise<FollowPagination> {
    const list = await this.dataSource.query<Follow[]>(
      `
SELECT
  p.user_id AS id,
  p.nick_name AS nickName,
  p.profile_image_url AS profileImageUrl
FROM profile p
JOIN follower f
ON p.user_id = f.from_user_id
WHERE f.to_user_id = ?
LIMIT ? OFFSET ?;
    `,
      [user.uid, limit, offset],
    );

    return {
      limit,
      offset,
      total: await this.followerRepository.countBy({ fromUserId: user.uid }),
      list,
    };
  }

  async updateUserFollow(
    claims: FirebaseUser,
    id: string,
    follow: boolean,
  ): Promise<UserVO> {
    try {
      await this.firebaseService.getAuth().getUser(id);
    } catch {
      throw new GraphQLError('해당하는 유저가 없습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.withRepository(
        this.followerRepository,
      );
      const exists = await this.followerRepository.exist({
        where: { fromUserId: claims.uid, toUserId: id },
      });
      if (follow && !exists) {
        /**
         * @description 대상을 팔로우를 하며, 이전에 팔로우한 내역이 존재하지 않을 경우
         */
        await repository.save([{ fromUserId: claims.uid, toUserId: id }]);
      } else if (exists) {
        /**
         * @description 대상을 언팔로우 하며, 이전에 팔로우한 내역이 존재할 경우
         */
        await repository.delete({
          fromUserId: claims.uid,
          toUserId: id,
        });
      }
      await queryRunner.commitTransaction();
      return this.getUser(id);
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateProfile(
    user: FirebaseUser,
    { id, ...input }: UpdateProfileInput,
  ): Promise<UpdateProfilePayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.withRepository(
        this.profileRepository,
      );
      await repository
        .createQueryBuilder()
        .update()
        .set(input)
        .where('user_id = :id', { id: user.uid })
        .execute();
      await queryRunner.commitTransaction();
      const { id: profileId, ...result } = await repository.findOneBy({
        userId: user.uid,
      });
      return { id: user.uid, ...result };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
