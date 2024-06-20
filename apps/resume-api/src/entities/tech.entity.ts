import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ResumeProjectTech } from './resume-project-tech.entity';

@Entity('tech', { schema: process.env.MYSQL_DATABASE })
export class Tech {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 16 })
  name: string;

  @OneToMany(() => ResumeProjectTech, (resumeProjectTech) => resumeProjectTech.tech)
  resumeProjectTeches: ResumeProjectTech[];

  @Column('varchar', { name: 'keywords', length: 128 })
  keywords: string;
}
