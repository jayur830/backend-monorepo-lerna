import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';

@Index('user_id', ['userId'], {})
@Entity('place_rating', { schema: 'crazyplace-dev' })
export class PlaceRating {
  @Column('varchar', { primary: true, name: 'place_id', length: 32 })
  placeId: string;

  @Column('varchar', { primary: true, name: 'user_id', length: 64 })
  userId: string;

  @Column('int', { name: 'rating', default: () => "'0'" })
  rating: number;

  @ManyToOne(() => User, (user) => user.placeRatings, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
