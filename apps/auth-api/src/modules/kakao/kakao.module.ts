import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { KakaoService } from './kakao.service';

@Module({
  imports: [HttpModule],
  providers: [KakaoService],
  exports: [KakaoService],
})
export class KakaoModule {}
