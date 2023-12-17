import { Field, ObjectType, PickType } from '@nestjs/graphql';

import { Paginated } from '@/utils/paginated.util';

import { Review } from './review.vo';

@ObjectType({ description: '리뷰 데이터 Pagination' })
export class ReviewPagination extends Paginated(Review) {
  @Field(() => [Review], { description: '리뷰 목록' })
  list: Review[];
}

@ObjectType()
export class ReviewPaginationOffsetLimit extends PickType(ReviewPagination, [
  'limit',
  'offset',
]) {}
