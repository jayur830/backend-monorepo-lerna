import { Column, Entity } from 'typeorm';

@Entity('place_rating', { schema: process.env.MYSQL_DATABASE })
export class PlaceRating {
  @Column('varchar', { primary: true, name: 'place_id', length: 32 })
  placeId: string;

  @Column('varchar', { primary: true, name: 'user_id', length: 28 })
  userId: string;

  @Column('int', { name: 'rating', default: () => "'0'" })
  rating: number;
}
