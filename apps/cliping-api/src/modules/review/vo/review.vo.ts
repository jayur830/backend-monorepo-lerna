import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql';
import { Dayjs } from 'dayjs';
import { DateTimeScalar } from '@toy/scalar';

import { ReviewUser } from './review-user.vo';

@ObjectType({ description: '리뷰 상세 정보' })
export class Review {
  @Field(() => Int, { description: '리뷰 ID (PK)' })
  id: number;

  @Field(() => String, { description: '장소 ID' })
  placeId: string;

  @Field(() => ReviewUser, { description: '리뷰 작성 유저' })
  user: ReviewUser;

  @Field(() => String, { description: '리뷰 제목' })
  title: string;

  @Field(() => String, { description: '리뷰 내용', nullable: true })
  content: string | null;

  @Field(() => String, { description: '첨부 이미지', nullable: true })
  imageUrl: string | null;

  @Field(() => Int, { description: '좋아요 수' })
  like: number;

  @Field(() => Int, { description: '평점' })
  rating: number;

  @Field(() => String, { description: '인스타그램 업로드 URL', nullable: true })
  instagramPostUrl: string | null;

  @Field(() => DateTimeScalar, { description: '리뷰 생성일자' })
  createdAt: Dayjs;

  @Field(() => DateTimeScalar, { description: '리뷰 수정일자' })
  updatedAt: Dayjs;
}

@ObjectType()
export class CreateReviewPayload extends OmitType(Review, [
  'user',
  'like',
  'createdAt',
  'updatedAt',
]) {}

@InputType()
export class CreateReviewInput extends OmitType(Review, [
  'id',
  'user',
  'like',
  'createdAt',
  'updatedAt',
]) {}

@ObjectType()
export class UpdateReviewPayload extends OmitType(Review, [
  'user',
  'like',
  'createdAt',
  'updatedAt',
]) {}

@InputType({ description: '리뷰 정보 수정' })
export class UpdateReviewInput extends PartialType(
  OmitType(Review, ['user', 'like', 'createdAt', 'updatedAt']),
) {
  @Field(() => Int, { description: '리뷰 ID (PK)' })
  id: number;
}
