import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '팔로워 유저 또는 팔로잉 유저' })
export class Follow {
  @Field(() => String, { description: '유저 ID (PK)' })
  id: string;

  @Field(() => String, { description: '닉네임' })
  nickName: string;

  @Field(() => String, { description: '프로필 사진 URL', nullable: true })
  profileImageUrl: string | null;
}
