import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Follower } from '@/entities/follower.entity';

import { FollowerResolver } from './follower.resolver';
import { FollowerService } from './follower.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follower])],
  providers: [FollowerResolver, FollowerService],
  exports: [FollowerService],
})
export class FollowerModule {}
