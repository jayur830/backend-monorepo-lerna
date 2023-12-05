import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Review } from './review.entity';
import { User } from './user.entity';

@Index('user_id', ['userId'], {})
@Index('review_id', ['reviewId'], {})
@Entity('review_like', { schema: 'crazyplace-dev' })
export class ReviewLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_id', length: 64 })
  userId: string;

  @Column('int', { name: 'review_id' })
  reviewId: number;

  @ManyToOne(() => User, (user) => user.reviewLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Review, (review) => review.reviewLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'review_id', referencedColumnName: 'id' }])
  review: Review;
}
