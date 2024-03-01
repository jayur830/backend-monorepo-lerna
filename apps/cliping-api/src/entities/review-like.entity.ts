import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Review } from './review.entity';

@Index('review_id', ['reviewId'], {})
@Entity('review_like', { schema: process.env.MYSQL_DATABASE })
export class ReviewLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_id', length: 28 })
  userId: string;

  @Column('int', { name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => Review, (review) => review.reviewLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
  review: Review;
}
