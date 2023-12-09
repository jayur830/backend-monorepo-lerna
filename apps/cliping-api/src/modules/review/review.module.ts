import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';

import { ReviewMutationResolver } from './review.mutation.resolver';
import { ReviewQueryResolver } from './review.query.resolver';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewLike])],
  providers: [ReviewQueryResolver, ReviewMutationResolver, ReviewService],
})
export class ReviewModule {}
