import { UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';
import { GraphQLResolveInfo } from 'graphql';

import { ReviewService } from './review.service';
import { CreateReviewInput, UpdateReviewPayload } from './vo/review.vo';
import { CreateReviewPayload, Review } from './vo/review.vo';
import { UpdateReviewInput } from './vo/review.vo';
import { ReviewFilter } from './vo/review-filter.vo';
import {
  ReviewPagination,
  ReviewPaginationOffsetLimit,
} from './vo/review-pagination.vo';

@Resolver(() => ReviewPagination)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => ReviewPagination, { description: '리뷰 목록 조회' })
  async reviewList(
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
  ): Promise<ReviewPaginationOffsetLimit> {
    return { limit, offset };
  }

  @ResolveField()
  total(@Info() info: GraphQLResolveInfo): Promise<number> {
    return this.reviewService.getReviewListTotal(
      info.variableValues.filter as ReviewFilter,
    );
  }

  @ResolveField()
  list(
    @Info() info: GraphQLResolveInfo,
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
  ): Promise<Review[]> {
    const limit = info.variableValues.limit as number;
    const offset = info.variableValues.offset as number;
    return this.reviewService.getReviewList(limit ?? 10, offset ?? 0, filter);
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateReviewPayload, { description: '리뷰 등록' })
  Review_create(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => CreateReviewInput })
    input: CreateReviewInput,
  ): Promise<CreateReviewPayload> {
    return this.reviewService.createReview(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateReviewPayload, {
    description: `리뷰 수정

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
  Review_update(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => UpdateReviewInput })
    input: UpdateReviewInput,
  ): Promise<UpdateReviewPayload> {
    return this.reviewService.updateReview(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int, {
    description: `리뷰 좋아요 누르기

- return: \`number\` 해당 리뷰의 좋아요 총 개수
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
  Review_like(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'reviewId', type: () => Int, description: '리뷰 ID (PK)' })
    reviewId: number,
  ): Promise<number> {
    return this.reviewService.updateReviewLike(user, reviewId);
  }
}
