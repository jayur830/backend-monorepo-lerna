import { Controller, Headers, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { CustomTokenResponse } from './types/custom-token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  signIn(@Headers('authorization') authorization) {
    return this.authService.signIn(authorization);
  }

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
