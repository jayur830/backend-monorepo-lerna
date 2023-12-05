import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { UserContext } from '@/decorators/user-context.decorator';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { FirebaseUser } from '@/modules/firebase/types/user.interface';

import { ReviewService } from './review.service';
import { CreateReviewInput } from './vo/create-review-input.vo';
import { ReviewPayload } from './vo/review-payload.vo';
import { UpdateReviewInput } from './vo/update-review-input.vo';

@Resolver()
export class ReviewMutationResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ReviewPayload, { description: '리뷰 등록' })
  Review_create(
    @UserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => CreateReviewInput })
    input: CreateReviewInput,
  ): Promise<ReviewPayload> {
    return this.reviewService.createReview(user, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ReviewPayload, {
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
    @UserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => UpdateReviewInput })
    input: UpdateReviewInput,
  ): Promise<ReviewPayload> {
    return this.reviewService.updateReview(user, input);
  }

  @UseGuards(AuthGuard)
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
    @UserContext() user: FirebaseUser,
    @Args({ name: 'reviewId', type: () => Int, description: '리뷰 ID (PK)' })
    reviewId: number,
  ): Promise<number> {
    return this.reviewService.updateReviewLike(user, reviewId);
  }
}
