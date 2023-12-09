import { Field, InputType, PickType } from '@nestjs/graphql';

import { Profile } from './profile.vo';

@InputType({ description: '프로필 상세 정보 입력' })
export class UpdateProfileInput extends PickType(Profile, [
  'description',
  'subTitle',
  'backgroundImageUrl',
  'profileImageUrl',
  'instagramUrl',
]) {
  @Field(() => String, { description: '유저 ID (PK)' })
  id: string;

  @Field(() => String, { description: '닉네임', nullable: true })
  nickName: string | null;
}
