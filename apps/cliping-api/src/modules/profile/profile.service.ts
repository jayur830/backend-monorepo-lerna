import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FirebaseUser } from '@toy/firebase/types';
import { DataSource, Repository } from 'typeorm';

import { Profile } from '@/entities/profile.entity';

import {
  Profile as ProfileVO,
  UpdateProfileInput,
  UpdateProfilePayload,
} from './vo/profile.vo';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: string): Promise<ProfileVO> {
    const profile = await this.profileRepository.findOneBy({ userId });

    return {
      nickName: profile?.nickName,
      description: profile?.description,
      subTitle: profile?.subTitle,
      backgroundImageUrl: profile?.backgroundImageUrl,
      profileImageUrl: profile?.profileImageUrl,
      instagramUrl: profile?.instagramUrl,
    };
  }

  async updateProfile(
    user: FirebaseUser,
    { id, ...input }: UpdateProfileInput,
  ): Promise<UpdateProfilePayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(Profile, { userId: user.uid }, input);
      await queryRunner.commitTransaction();
      const { id: profileId, ...result } = await queryRunner.manager.findOneBy(
        Profile,
        { userId: user.uid },
      );
      return { id: user.uid, ...result };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
