import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Index('from_user_id', ['fromUserId'], {})
@Index('to_user_id', ['toUserId'], {})
@Entity('follower', { schema: 'crazyplace-dev' })
export class Follower {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'from_user_id', length: 64 })
  fromUserId: string;

  @Column('varchar', { name: 'to_user_id', length: 64 })
  toUserId: string;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'from_user_id', referencedColumnName: 'id' }])
  fromUser: User;

  @ManyToOne(() => User, (user) => user.followers2, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'to_user_id', referencedColumnName: 'id' }])
  toUser: User;
}
