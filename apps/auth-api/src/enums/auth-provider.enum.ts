import { registerEnumType } from '@nestjs/graphql';

export enum AuthProvider {
  KAKAO = 'KAKAO',
  NAVER = 'NAVER',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  APPLE = 'APPLE',
}

registerEnumType(AuthProvider, {
  name: 'AuthProvider',
  description: 'OAuth 인증 제공업체',
  valuesMap: {
    KAKAO: { description: 'Kakao' },
    NAVER: { description: 'NAVER' },
    GOOGLE: { description: 'Google' },
    FACEBOOK: { description: 'Facebook' },
    APPLE: { description: 'Apple' },
  },
});
