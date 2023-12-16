import { Field, ObjectType } from '@nestjs/graphql';

import { Pagination } from '@/interfaces/pagination/pagination.abstract';

import { Review } from './review.vo';

@ObjectType({ description: '리뷰 데이터 Pagination' })
export class ReviewPagination extends Pagination<Review> {
  @Field(() => [Review], { description: '리뷰 목록' })
  list: Review[];
}
