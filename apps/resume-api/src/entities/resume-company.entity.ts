import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyLogo } from './company-logo.entity';
import { ResumeInfo } from './resume-info.entity';
import { ResumeProject } from './resume-project.entity';

@Index('resume_info_id', ['resumeInfoId'], {})
@Index('logo_id', ['logoId'], {})
@Entity('resume_company', { schema: 'gh-page' })
export class ResumeCompany {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('date', { name: 'start_date' })
  startDate: string;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: string | null;

  @Column('varchar', { name: 'website', nullable: true, length: 128 })
  website: string | null;

  @Column('varchar', { name: 'description', nullable: true, length: 1024 })
  description: string | null;

  @Column('int', { name: 'resume_info_id' })
  resumeInfoId: number;

  @Column('int', { name: 'logo_id' })
  logoId: number;

  @ManyToOne(() => ResumeInfo, (resumeInfo) => resumeInfo.resumeCompanies, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'resume_info_id', referencedColumnName: 'id' }])
  resumeInfo: ResumeInfo;

  @ManyToOne(() => CompanyLogo, (companyLogo) => companyLogo.resumeCompanies, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'logo_id', referencedColumnName: 'id' }])
  logo: CompanyLogo;

  @OneToMany(() => ResumeProject, (resumeProject) => resumeProject.resumeCompany)
  resumeProjects: ResumeProject[];
}
