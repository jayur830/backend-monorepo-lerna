import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ReviewLike } from './review-like.entity';

@Entity('review', { schema: process.env.MYSQL_DATABASE })
export class Review {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 128 })
  title: string;

  @Column('varchar', { name: 'content', nullable: true, length: 4096 })
  content: string | null;

  @Column('varchar', { name: 'image_url', nullable: true, length: 128 })
  imageUrl: string | null;

  @Column('int', { name: 'rating', default: () => "'0'" })
  rating: number;

  @Column('varchar', {
    name: 'instagram_post_url',
    nullable: true,
    length: 128,
  })
  instagramPostUrl: string | null;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @Column('datetime', { name: 'updated_at' })
  updatedAt: Date;

  @Column('varchar', { name: 'user_id', length: 28 })
  userId: string;

  @Column('varchar', { name: 'place_id', length: 32 })
  placeId: string;

  @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.review)
  reviewLikes: ReviewLike[];
}
