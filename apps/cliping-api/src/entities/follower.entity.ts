import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('follower', { schema: process.env.MYSQL_DATABASE })
export class Follower {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'from_user_id', length: 28 })
  fromUserId: string;

  @Column('varchar', { name: 'to_user_id', length: 28 })
  toUserId: string;
}
