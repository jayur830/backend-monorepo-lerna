import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class NaverService {
  constructor(private readonly httpService: HttpService) {}

  async authorize(
    authorization: string,
    clientId: string,
    clientSecret: string,
  ) {
    const response = await this.httpService.axiosRef
      .get(
        `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${authorization}`,
      )
      .then((response) => response.data);

    if (response.error) {
      switch (response.error) {
        case 'invalid_request':
          throw new UnauthorizedException(
            'Invalid token. Please provide valid authorization code.',
          );
        default:
          throw response;
      }
    }

    return response;
  }

  async getMe(accessToken: string) {
    return this.httpService.axiosRef
      .get('https://openapi.naver.com/v1/nid/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data);
  }
}
