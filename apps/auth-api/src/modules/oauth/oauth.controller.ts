import { Controller, Headers, Post } from '@nestjs/common';

import { OAuthService } from './oauth.service';
import { CustomTokenResponse } from './types/custom-token.interface';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: OAuthService) {}

  @Post('/kakao')
  authenticateKakao(
    @Headers('authorization') authorization?: string,
  ): Promise<CustomTokenResponse> {
    return this.authService.authenticateKakao(authorization);
  }

  @Post('/naver')
  authenticateNaver(
    @Headers('authorization') authorization?: string,
  ): Promise<CustomTokenResponse> {
    return this.authService.authenticateNaver(authorization);
  }
}
