import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '리뷰 정보' })
export class ReviewPayload {
  @Field(() => Int, { description: '리뷰 ID (PK)' })
  id: number;

  @Field(() => String, { description: '리뷰 제목' })
  title: string;

  @Field(() => String, { description: '리뷰 내용' })
  content: string;

  @Field(() => String, { description: '첨부 이미지', nullable: true })
  imageUrl: string | null;

  @Field(() => Int, { description: '평점' })
  rating: number;

  @Field(() => String, { description: '인스타그램 업로드 URL', nullable: true })
  instagramPostUrl: string | null;

  @Field(() => String, { description: '리뷰 장소' })
  placeId: string;
}
