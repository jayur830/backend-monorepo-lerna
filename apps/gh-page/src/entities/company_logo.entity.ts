import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CompanyLogo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column({ default: '' })
  alt: string;

  @Column()
  width: number;

  @Column()
  height: number;
}
