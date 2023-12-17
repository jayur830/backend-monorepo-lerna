import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeCompany } from './resume-company.entity';

@Entity('company_logo', { schema: process.env.MYSQL_DATABASE })
export class CompanyLogo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'src', length: 256 })
  src: string;

  @Column('varchar', { name: 'alt', length: 16 })
  alt: string;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @OneToMany(() => ResumeCompany, (resumeCompany) => resumeCompany.logo)
  resumeCompanies: ResumeCompany[];
}
