import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Index('user_id', ['userId'], {})
@Entity('place_like', { schema: 'crazyplace-dev' })
export class PlaceLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'user_id', length: 64 })
  userId: string;

  @Column('varchar', { name: 'place_id', length: 32 })
  placeId: string;

  @ManyToOne(() => User, (user) => user.placeLikes, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
