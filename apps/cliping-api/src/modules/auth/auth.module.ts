import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule, FirebaseService } from '@toy/firebase';

import { User } from '@/entities/user.entity';

import { KakaoModule } from '../kakao/kakao.module';
import { KakaoService } from '../kakao/kakao.service';
import { NaverModule } from '../naver/naver.module';
import { NaverService } from '../naver/naver.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    FirebaseModule,
    HttpModule,
    KakaoModule,
    NaverModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FirebaseService,
    ConfigService,
    KakaoService,
    NaverService,
  ],
})
export class AuthModule {}
