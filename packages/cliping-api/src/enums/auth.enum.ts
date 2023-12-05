import { registerEnumType } from '@nestjs/graphql';

export enum AuthGuardType {
  Unauthorization = 'UNAUTHORIZATION',
  InvalidToken = 'INVALID_TOKEN',
  AuthorizationExpired = 'AUTHORIZATION_EXPIRED',
}

registerEnumType(AuthGuardType, {
  name: 'AuthGuardType',
  description: '인증 관련 예외처리 목록',
  valuesMap: {
    Unauthorization: { description: '토큰이 필요합니다.' },
    InvalidToken: { description: '토큰이 올바른 형식이 아닙니다.' },
    AuthorizationExpired: { description: '토큰이 만료되었습니다.' },
  },
});
