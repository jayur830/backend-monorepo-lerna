import { Field, ObjectType } from '@nestjs/graphql';

import { AuthProvider } from '@/enums/auth-provider.enum';

@ObjectType({ description: '로그인한 유저의 개인 정보' })
export class Me {
  @Field(() => String, { description: '이름' })
  name: string;

  @Field(() => String, { description: '이메일' })
  email: string;

  @Field(() => String, { description: '유저 ID (PK)' })
  userId: string;

  @Field(() => [String], { description: 'OAuth 인증 목록' })
  providers: AuthProvider[];
}
