import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeCompany } from './resume-company.entity';

@Entity('resume_info', { schema: process.env.MYSQL_DATABASE })
export class ResumeInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 64 })
  title: string;

  @Column('varchar', { name: 'email', nullable: true, length: 64 })
  email: string | null;

  @Column('varchar', { name: 'github', nullable: true, length: 128 })
  github: string | null;

  @Column('varchar', { name: 'blog', nullable: true, length: 256 })
  blog: string | null;

  @Column('varchar', { name: 'user_id', length: 28 })
  userId: string;

  @OneToMany(() => ResumeCompany, (resumeCompany) => resumeCompany.resumeInfo)
  resumeCompanies: ResumeCompany[];
}
