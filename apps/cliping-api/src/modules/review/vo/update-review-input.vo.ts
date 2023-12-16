import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({ description: '리뷰 정보 수정' })
export class UpdateReviewInput {
  @Field(() => Int, { description: '리뷰 ID (PK)' })
  id: number;

  @Field(() => String, { description: '리뷰 제목', nullable: true })
  title: string | null;

  @Field(() => String, { description: '리뷰 내용', nullable: true })
  content: string | null;

  @Field(() => String, { description: '첨부 이미지', nullable: true })
  imageUrl: string | null;

  @Field(() => Int, { description: '평점', nullable: true, defaultValue: 0 })
  rating: number | null;

  @Field(() => String, { description: '인스타그램 업로드 URL', nullable: true })
  instagramPostUrl: string | null;

  @Field(() => String, { description: '리뷰 장소' })
  placeId: string;
}
