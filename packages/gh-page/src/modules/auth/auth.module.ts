import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@/entities/user.entity';
import { FirebaseModule } from '@/modules/firebase/firebase.module';
import { FirebaseService } from '@/modules/firebase/firebase.service';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([User])],
  providers: [FirebaseService, AuthService, AuthResolver],
  exports: [],
})
export class AuthModule {}
