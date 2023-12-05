import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPayload {
  @Field({ description: '이메일' })
  email: string;

  @Field({ description: '로그인 상태 여부' })
  isLogged: boolean;
}
