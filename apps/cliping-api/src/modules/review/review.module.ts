import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';

import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewLike])],
  providers: [ReviewResolver, ReviewService],
})
export class ReviewModule {}
