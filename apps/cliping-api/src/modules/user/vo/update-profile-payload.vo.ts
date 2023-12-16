import { Field, ObjectType } from '@nestjs/graphql';

import { Profile } from './profile.vo';

@ObjectType({ description: '프로필 상세 정보' })
export class UpdateProfilePayload extends Profile {
  @Field(() => String, { description: '유저 ID (PK)' })
  id: string;

  @Field(() => String, { description: '닉네임' })
  nickName: string;
}
