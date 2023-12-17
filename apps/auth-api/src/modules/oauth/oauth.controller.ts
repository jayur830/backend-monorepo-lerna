import { Controller, Headers, Param, Post } from '@nestjs/common';

import { OAuthService } from './oauth.service';
import { CustomTokenResponse } from './types/custom-token.interface';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: OAuthService) {}

  @Post('/kakao/:service')
  authenticateKakao(
    @Param('service') service: string,
    @Headers('authorization') authorization?: string,
  ): Promise<CustomTokenResponse> {
    return this.authService.authenticateKakao(service, authorization);
  }

  @Post('/naver/:service')
  authenticateNaver(
    @Param('service') service: string,
    @Headers('authorization') authorization?: string,
  ): Promise<CustomTokenResponse> {
    return this.authService.authenticateNaver(service, authorization);
  }
}
