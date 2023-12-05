import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeHistory } from './resume_history.entity';

@Entity()
export class ResumeInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  github: string | null;

  @OneToMany(() => ResumeHistory, (history) => history.resumeInfo, { lazy: true })
  history: ResumeHistory[];
}
