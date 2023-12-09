import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '리뷰 검색 필터' })
export class ReviewFilter {
  @Field(() => String, { description: '장소 ID (PK)', nullable: true })
  placeId: string | null;

  @Field(() => String, { description: '검색어', nullable: true })
  keyword: string | null;
}
