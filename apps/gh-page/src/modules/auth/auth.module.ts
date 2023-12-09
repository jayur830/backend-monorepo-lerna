import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from '@toy/firebase';
import { FirebaseService } from '@toy/firebase';

import { User } from '@/entities/user.entity';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseModule, TypeOrmModule.forFeature([User])],
  providers: [FirebaseService, AuthService, AuthResolver],
})
export class AuthModule {}
