import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile', { schema: process.env.MYSQL_DATABASE })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'nick_name', length: 128 })
  nickName: string;

  @Column('varchar', { name: 'description', nullable: true, length: 4096 })
  description: string | null;

  @Column('varchar', { name: 'sub_title', nullable: true, length: 256 })
  subTitle: string | null;

  @Column('varchar', {
    name: 'background_image_url',
    nullable: true,
    length: 128,
  })
  backgroundImageUrl: string | null;

  @Column('varchar', { name: 'profile_image_url', nullable: true, length: 128 })
  profileImageUrl: string | null;

  @Column('varchar', { name: 'instagram_url', nullable: true, length: 128 })
  instagramUrl: string | null;

  @Column('varchar', { name: 'user_id', length: 28 })
  userId: string;
}
