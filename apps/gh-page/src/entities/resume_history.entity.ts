import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { CompanyLogo } from './company_logo.entity';
import { ResumeHistoryDetail } from './resume_history_detail.entity';
import { ResumeInfo } from './resume_info.entity';

@Entity()
export class ResumeHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'company_name' })
  companyName: string;

  @Column({ name: 'start_date' })
  startDate: string;

  @Column({ name: 'end_date', nullable: true })
  endDate: string | null;

  @Column({ nullable: true })
  website: string | null;

  @Column({ default: '', length: 2 ** 12 - 1 })
  description: string;

  @ManyToOne(() => ResumeInfo, (info) => info.history, { cascade: true })
  @JoinColumn({ name: 'resume_info_id' })
  resumeInfo: ResumeInfo;

  @OneToMany(() => ResumeHistoryDetail, (careers) => careers.history)
  careers: ResumeHistoryDetail[];

  @OneToOne(() => CompanyLogo, (logo) => logo.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'logo_id' })
  logo: CompanyLogo;
}
