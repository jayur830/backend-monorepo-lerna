import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql';

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

  @Field(() => String, { description: '리뷰 생성일자' })
  createdAt: string;

  @Field(() => String, { description: '리뷰 수정일자' })
  updatedAt: string;
}

@ObjectType()
export class CreateReviewPayload extends OmitType(Review, [
  'user',
  'like',
  'createdAt',
  'updatedAt',
]) {}

@InputType()
export class CreateReviewInput {
  @Field(() => String, { description: '장소 ID' })
  placeId: string;

  @Field(() => String, { description: '리뷰 제목' })
  title: string;

  @Field(() => String, { description: '리뷰 내용', nullable: true })
  content: string | null;

  @Field(() => String, { description: '첨부 이미지', nullable: true })
  imageUrl: string | null;

  @Field(() => Int, { description: '평점' })
  rating: number;

  @Field(() => String, { description: '인스타그램 업로드 URL', nullable: true })
  instagramPostUrl: string | null;
}

@ObjectType()
export class UpdateReviewPayload extends OmitType(Review, [
  'user',
  'like',
  'createdAt',
  'updatedAt',
]) {}

@InputType({ description: '리뷰 정보 수정' })
export class UpdateReviewInput {
  @Field(() => Int, { description: '리뷰 ID (PK)' })
  id: number;

  @Field(() => String, { description: '리뷰 제목', nullable: true })
  title: string | null;

  @Field(() => String, { description: '리뷰 내용', nullable: true })
  content: string | null;

  @Field(() => String, { description: '첨부 이미지', nullable: true })
  imageUrl: string | null;

  @Field(() => Int, { description: '평점', nullable: true, defaultValue: 0 })
  rating: number | null;

  @Field(() => String, { description: '인스타그램 업로드 URL', nullable: true })
  instagramPostUrl: string | null;

  @Field(() => String, { description: '장소 ID' })
  placeId: string;
}
