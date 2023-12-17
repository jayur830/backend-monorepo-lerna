import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeCompany } from './resume-company.entity';
import { ResumeProjectTech } from './resume-project-tech.entity';

@Index('resume_company_id', ['resumeCompanyId'], {})
@Entity('resume_project', { schema: process.env.MYSQL_DATABASE })
export class ResumeProject {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'group', nullable: true, length: 32 })
  group: string | null;

  @Column('varchar', { name: 'title', length: 64 })
  title: string;

  @Column('varchar', { name: 'description', nullable: true, length: 1024 })
  description: string | null;

  @Column('date', { name: 'start_date' })
  startDate: string;

  @Column('date', { name: 'end_date', nullable: true })
  endDate: string | null;

  @Column('int', { name: 'resume_company_id' })
  resumeCompanyId: number;

  @ManyToOne(() => ResumeCompany, (resumeCompany) => resumeCompany.resumeProjects, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([{ name: 'resume_company_id', referencedColumnName: 'id' }])
  resumeCompany: ResumeCompany;

  @OneToMany(() => ResumeProjectTech, (resumeProjectTech) => resumeProjectTech.resumeProject)
  resumeProjectTeches: ResumeProjectTech[];
}
