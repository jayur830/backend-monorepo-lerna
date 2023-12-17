import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import type { FirebaseUser } from '@toy/firebase/types';
import { GraphQLError } from 'graphql';
import { DataSource, Repository } from 'typeorm';

import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';
import { GqlErrorCode } from '@/enums/error.enum';

import { ReviewProjection } from './types/review-projection.interface';
import {
  CreateReviewInput,
  CreateReviewPayload,
  Review as ReviewVO,
  UpdateReviewInput,
  UpdateReviewPayload,
} from './vo/review.vo';
import { ReviewFilter } from './vo/review-filter.vo';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(ReviewLike)
    private readonly reviewLikeRepository: Repository<ReviewLike>,
    private readonly dataSource: DataSource,
  ) {}

  async getReviewList(
    limit: number,
    offset: number,
    filter: ReviewFilter,
  ): Promise<ReviewVO[]> {
    if (filter.placeId && filter.keyword) {
      const where = `r.place_id = ${filter.placeId}\nAND (\n\tr.title LIKE "%${filter.keyword}%"\n\tOR r.content LIKE "%${filter.keyword}%"\n)`;
      const results = await this.dataSource.query<ReviewProjection[]>(
        this.getReviewListQuery(limit, offset, where),
      );
      return this.getReviewPagination(results);
    } else if (filter.placeId) {
      const where = `r.place_id = ${filter.placeId}`;
      const results = await this.dataSource.query<ReviewProjection[]>(
        this.getReviewListQuery(limit, offset, where),
      );
      return this.getReviewPagination(results);
    } else if (filter.keyword) {
      const where = `r.title LIKE "%${filter.keyword}%"\nOR r.content LIKE "%${filter.keyword}%"`;
      const results = await this.dataSource.query<ReviewProjection[]>(
        this.getReviewListQuery(limit, offset, where),
      );
      return this.getReviewPagination(results);
    } else {
      const results = await this.dataSource.query<ReviewProjection[]>(
        this.getReviewListQuery(limit, offset, ''),
      );
      return this.getReviewPagination(results);
    }
  }

  async getReviewListTotal(filter: ReviewFilter) {
    if (filter.placeId && filter.keyword) {
      const where = `r.place_id = ${filter.placeId}\nAND (\n\tr.title LIKE "%${filter.keyword}%"\n\tOR r.content LIKE "%${filter.keyword}%"\n)`;
      const [{ total }] = await this.dataSource.query<[{ total: number }]>(
        this.getReviewTotalCountQuery(where),
      );
      return total;
    } else if (filter.placeId) {
      const where = `r.place_id = ${filter.placeId}`;
      const [{ total }] = await this.dataSource.query<[{ total: number }]>(
        this.getReviewTotalCountQuery(where),
      );
      return total;
    } else if (filter.keyword) {
      const where = `r.title LIKE "%${filter.keyword}%"\nOR r.content LIKE "%${filter.keyword}%"`;
      const [{ total }] = await this.dataSource.query<[{ total: number }]>(
        this.getReviewTotalCountQuery(where),
      );
      return total;
    } else {
      const [{ total }] = await this.dataSource.query<[{ total: number }]>(
        this.getReviewTotalCountQuery(''),
      );
      return total;
    }
  }

  async getReview(id: number): Promise<ReviewVO> {
    const [review] = await this.dataSource.query<[ReviewProjection]>(
      this.getReviewListQuery(1, 0, `r.id = ${id}`),
    );

    if (!review) {
      throw new GraphQLError('해당 ID의 리뷰가 존재하지 않습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    return {
      id: review.id,
      placeId: review.place_id,
      user: {
        id: review.user_id,
        profileImageUrl: review.profile_image_url,
      },
      title: review.title,
      content: review.content,
      imageUrl: review.image_Url,
      like: review.review_like_count,
      rating: review.rating,
      instagramPostUrl: review.instagram_post_url,
      createdAt: dayjs(review.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(review.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  async createReview(
    user: FirebaseUser,
    input: CreateReviewInput,
  ): Promise<CreateReviewPayload> {
    const [result] = await this.reviewRepository.save([
      {
        ...input,
        userId: user.uid,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    ]);

    return result;
  }

  async updateReview(
    user: FirebaseUser,
    input: UpdateReviewInput,
  ): Promise<UpdateReviewPayload> {
    const isExistsReview = await this.reviewRepository.exist({
      where: { id: input.id },
    });

    if (!isExistsReview) {
      throw new GraphQLError('해당 ID의 리뷰가 존재하지 않습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    const [result] = await this.reviewRepository.save([
      {
        ...input,
        userId: user.uid,
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      },
    ]);

    return result;
  }

  async updateReviewLike(
    user: FirebaseUser,
    reviewId: number,
  ): Promise<number> {
    const isExistsReview = await this.reviewRepository.exist({
      where: { id: reviewId },
    });

    if (!isExistsReview) {
      throw new GraphQLError('해당 ID의 리뷰가 존재하지 않습니다.', {
        extensions: { code: GqlErrorCode.ReviewNotExists },
      });
    }

    const criteria = { reviewId, userId: user.uid };
    const reviewLikeCount = await this.reviewLikeRepository.countBy(criteria);

    if (!reviewLikeCount) {
      await this.reviewLikeRepository.save(criteria);
    } else {
      await this.reviewLikeRepository.delete(criteria);
    }

    return await this.reviewLikeRepository.count({ where: { reviewId } });
  }

  private getReviewListQuery(limit: number, offset: number, where: string) {
    return `
SELECT
  r.id,
  r.title,
  r.content,
  r.image_url,
  r.rating,
  r.instagram_post_url,
  r.created_at,
  r.updated_at,
  r.user_id,
  r.place_id,
  p.profile_image_url,
  COUNT(l.review_id) AS review_like_count
FROM review r
LEFT JOIN profile p
ON r.user_id = p.user_id
LEFT JOIN review_like l
ON r.user_id = l.user_id
AND r.id = l.review_id${where ? `\nWHERE ${where}` : ''}
GROUP BY
  r.id,
  r.title,
  r.content,
  r.image_url,
  r.rating,
  r.instagram_post_url,
  r.created_at,
  r.updated_at,
  r.user_id,
  r.place_id,
  p.profile_image_url
LIMIT ${limit}
OFFSET ${offset};`;
  }

  private getReviewTotalCountQuery(where: string) {
    return `SELECT COUNT(1) AS total FROM review r${
      where ? `\nWHERE ${where}` : ''
    };`;
  }

  private getReviewPagination(reviewList: ReviewProjection[]) {
    return reviewList.map((item) => ({
      id: item.id,
      placeId: item.place_id,
      user: {
        id: item.user_id,
        profileImageUrl: item.profile_image_url,
      },
      title: item.title,
      content: item.content,
      imageUrl: item.image_Url,
      like: item.review_like_count,
      rating: item.rating,
      instagramPostUrl: item.instagram_post_url,
      createdAt: dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    }));
  }
}
