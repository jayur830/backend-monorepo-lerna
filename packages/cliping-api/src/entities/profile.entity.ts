import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Index('user_id', ['userId'], {})
@Entity('profile', { schema: 'crazyplace-dev' })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nick_name', length: 128 })
  nickName: string;

  @Column('varchar', { name: 'description', nullable: true, length: 4096 })
  description: string | null;

  @Column('varchar', { name: 'sub_title', nullable: true, length: 255 })
  subTitle: string | null;

  @Column('varchar', {
    name: 'background_image_url',
    nullable: true,
    length: 127,
  })
  backgroundImageUrl: string | null;

  @Column('varchar', { name: 'profile_image_url', nullable: true, length: 127 })
  profileImageUrl: string | null;

  @Column('varchar', {
    name: 'instagram_url',
    nullable: true,
    length: 127,
  })
  instagramUrl: string | null;

  @Column('varchar', { name: 'user_id', length: 64 })
  userId: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
