import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { FirebaseService } from '@toy/firebase';
import type { FirebaseUser } from '@toy/firebase/types';
import { GraphQLError } from 'graphql';
import { DataSource, Repository } from 'typeorm';

import { Follower } from '@/entities/follower.entity';
import { Review } from '@/entities/review.entity';
import { GqlErrorCode } from '@/enums/error.enum';
import { FollowerService } from '@/modules/follower/follower.service';
import { ProfileService } from '@/modules/profile/profile.service';

import { Me } from './vo/me.vo';
import { User as UserVO, UserSummary } from './vo/user.vo';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly firebaseService: FirebaseService,
    private readonly profileService: ProfileService,
    private readonly followerService: FollowerService,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async getMe(user: FirebaseUser): Promise<Me> {
    const firebaseUser = await this.firebaseService.getAuth().getUser(user.uid);
    return {
      name: user.name,
      email: user.email,
      userId: user.uid,
      providers: firebaseUser.customClaims.cliping?.providers,
    };
  }

  async getUser(id: string): Promise<UserSummary> {
    try {
      const firebaseUser = await this.firebaseService.getAuth().getUser(id);

      return {
        id,
        createdAt: dayjs(firebaseUser.metadata.creationTime).format(
          'YYYY-MM-DD HH:mm:ss',
        ),
      };
    } catch {
      throw new GraphQLError('해당하는 유저가 없습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }
  }

  getReviewCount(userId: string): Promise<number> {
    return this.reviewRepository.countBy({ userId });
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

      const [userInfo, profile, followerCount, followingCount, reviewCount] =
        await Promise.all([
          this.getUser(id),
          this.profileService.getProfile(id),
          this.followerService.getFollowerListTotal(id),
          this.followerService.getFollowingListTotal(id),
          this.getReviewCount(id),
        ]);

      return {
        ...userInfo,
        profile,
        followerCount,
        followingCount,
        reviewCount,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
