import { Field, Int, ObjectType } from '@nestjs/graphql';

import { Profile } from './profile.vo';

@ObjectType({ description: '유저 상세 정보' })
export class User {
  @Field(() => String, { description: '유저 ID (PK)' })
  id: string;

  @Field(() => String, { description: '닉네임', nullable: true })
  nickName: string;

  @Field(() => String, { description: '생성일자' })
  createdAt: string;

  @Field(() => Profile, { description: '프로필 상세' })
  profile: Profile;

  @Field(() => Int, { description: '팔로워 수' })
  followerCount: number;

  @Field(() => Int, { description: '팔로잉 수' })
  followingCount: number;

  @Field(() => Int, { description: '작성한 리뷰 수' })
  reviewCount: number;
}
