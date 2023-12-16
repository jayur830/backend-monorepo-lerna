import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { PropertyKeys } from './enums';

@Injectable()
export class KakaoService {
  constructor(private readonly httpService: HttpService) {}

  getMe(authorization: string, propertyKeys: PropertyKeys[]) {
    return this.httpService.axiosRef.post(
      'https://kapi.kakao.com/v2/user/me',
      {
        property_keys: propertyKeys,
      },
      {
        headers: {
          Authorization: `Bearer ${authorization}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
  }
}
