import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '리뷰 작성 유저' })
export class ReviewUser {
  @Field(() => String, { description: '유저 ID (PK)' })
  id: string;

  @Field(() => String, { description: '프로필 사진 URL', nullable: true })
  profileImageUrl: string | null;
}
