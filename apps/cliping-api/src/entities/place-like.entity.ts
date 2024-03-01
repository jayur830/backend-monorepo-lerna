import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('place_like', { schema: process.env.MYSQL_DATABASE })
export class PlaceLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_id', length: 28 })
  userId: string;

  @Column('varchar', { name: 'place_id', length: 32 })
  placeId: string;
}
