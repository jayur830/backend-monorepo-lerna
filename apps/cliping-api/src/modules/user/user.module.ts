import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule, FirebaseService } from '@toy/firebase';

import { Follower } from '@/entities/follower.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { User } from '@/entities/user.entity';

import { UserMutationResolver } from './user.mutation.resolver';
import { UserQueryResolver } from './user.query.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    FirebaseModule,
    TypeOrmModule.forFeature([User, Profile, Follower, Review]),
  ],
  providers: [
    UserQueryResolver,
    UserMutationResolver,
    UserService,
    FirebaseService,
  ],
})
export class UserModule {}
