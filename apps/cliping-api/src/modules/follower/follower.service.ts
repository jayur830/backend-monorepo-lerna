import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FirebaseUser } from '@toy/firebase/types';
import { DataSource, Repository } from 'typeorm';

import { Follower } from '@/entities/follower.entity';

import { Follow } from './vo/follow.vo';

@Injectable()
export class FollowerService {
  private readonly logger = new Logger(FollowerService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
  ) {}

  async getFollowerList(
    user: FirebaseUser,
    limit: number,
    offset: number,
  ): Promise<Follow[]> {
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

    return list;
  }

  getFollowerListTotal(userId: string): Promise<number> {
    return this.followerRepository.countBy({ toUserId: userId });
  }

  async getFollowingList(
    user: FirebaseUser,
    limit: number,
    offset: number,
  ): Promise<Follow[]> {
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

    return list;
  }

  getFollowingListTotal(userId: string): Promise<number> {
    return this.followerRepository.countBy({ fromUserId: userId });
  }
}
