import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { ReviewService } from './review.service';
import { Review } from './vo/review.vo';
import { ReviewFilter } from './vo/review-filter.vo';
import { ReviewPagination } from './vo/review-pagination.vo';

@Resolver()
export class ReviewQueryResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => ReviewPagination, { description: '리뷰 목록 조회' })
  reviewList(
    @Args({
      name: 'limit',
      type: () => Int,
      nullable: true,
      description: 'limit',
      defaultValue: 10,
    })
    limit: number,
    @Args({
      name: 'offset',
      type: () => Int,
      nullable: true,
      description: 'offset',
      defaultValue: 0,
    })
    offset: number,
    @Args({
      name: 'filter',
      type: () => ReviewFilter,
      nullable: true,
      description: '검색 필터 (placeId: 장소 ID, keyword: 검색어)',
      defaultValue: {
        placeId: null,
        keyword: null,
      },
    })
    filter: ReviewFilter,
  ): Promise<ReviewPagination> {
    return this.reviewService.getReviewList(limit, offset, filter);
  }

  @Query(() => Review, {
    description: `리뷰 조회

- throw
\`\`\`json
// ID에 대한 리뷰가 없을 경우
{
  "message": "해당 ID의 리뷰가 존재하지 않습니다.",
  "extensions": {
    "code": "REVIEW_NOT_EXISTS"
  }
}
\`\`\``,
  })
  review(
    @Args({ name: 'id', type: () => Int, description: '리뷰 ID (PK)' })
    id: number,
  ): Promise<Review> {
    return this.reviewService.getReview(id);
  }
}
