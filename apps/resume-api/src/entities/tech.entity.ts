import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeProject } from './resume-project.entity';
import { ResumeProjectTech } from './resume-project-tech.entity';

@Entity('tech', { schema: 'gh-page' })
export class Tech {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 16 })
  name: string;

  @OneToMany(() => ResumeProjectTech, (resumeProjectTech) => resumeProjectTech.tech)
  resumeProjectTeches: ResumeProjectTech[];
}
