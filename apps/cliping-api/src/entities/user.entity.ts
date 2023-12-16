import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { Follower } from './follower.entity';
import { PlaceLike } from './place-like.entity';
import { PlaceRating } from './place-rating.entity';
import { Profile } from './profile.entity';
import { Review } from './review.entity';
import { ReviewLike } from './review-like.entity';

@Entity('user', { schema: 'crazyplace-dev' })
export class User {
  @Column('varchar', { primary: true, name: 'id', length: 64 })
  id: string;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'email', length: 64 })
  email: string;

  @Column('varchar', { name: 'provider', length: 16 })
  provider: string;

  @Column('datetime', { name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Follower, (follower) => follower.fromUser)
  followers: Follower[];

  @OneToMany(() => Follower, (follower) => follower.toUser)
  followers2: Follower[];

  @OneToMany(() => PlaceLike, (placeLike) => placeLike.user)
  placeLikes: PlaceLike[];

  @OneToMany(() => PlaceRating, (placeRating) => placeRating.user)
  placeRatings: PlaceRating[];

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => ReviewLike, (reviewLike) => reviewLike.user)
  reviewLikes: ReviewLike[];
}
