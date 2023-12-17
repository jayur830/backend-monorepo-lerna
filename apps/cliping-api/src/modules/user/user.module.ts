import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule, FirebaseService } from '@toy/firebase';

import { Follower } from '@/entities/follower.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { FollowerService } from '@/modules/follower/follower.service';
import { ProfileService } from '@/modules/profile/profile.service';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([Profile, Follower, Review]),
  ],
  providers: [
    UserResolver,
    UserService,
    ProfileService,
    FollowerService,
    FirebaseService,
  ],
})
export class UserModule {}
