import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseModule, FirebaseService } from '@toy/firebase';

import { KakaoModule } from '@/modules/kakao/kakao.module';
import { KakaoService } from '@/modules/kakao/kakao.service';
import { NaverModule } from '@/modules/naver/naver.module';
import { NaverService } from '@/modules/naver/naver.service';

import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

@Module({
  imports: [FirebaseModule, HttpModule, KakaoModule, NaverModule],
  controllers: [OAuthController],
  providers: [
    OAuthService,
    FirebaseService,
    ConfigService,
    KakaoService,
    NaverService,
  ],
})
export class OAuthModule {}
