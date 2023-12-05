import { registerEnumType } from '@nestjs/graphql';

export enum GqlErrorCode {
  ReviewNotExists = 'REVIEW_NOT_EXISTS',
  UserNotExists = 'USER_NOT_EXISTS',
}

registerEnumType(GqlErrorCode, {
  name: 'GqlErrorCode',
  description: '서비스 예외처리 목록',
  valuesMap: {
    ReviewNotExists: { description: '해당 ID의 리뷰가 존재하지 않습니다.' },
    UserNotExists: { description: '해당하는 유저가 없습니다.' },
  },
});
