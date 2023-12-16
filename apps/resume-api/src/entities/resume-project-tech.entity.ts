import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ResumeProject } from './resume-project.entity';
import { Tech } from './tech.entity';

@Index('tech_id', ['techId'], {})
@Index('resume_project_id', ['resumeProjectId'], {})
@Entity('resume_project_tech', { schema: 'gh-page' })
export class ResumeProjectTech {
  @PrimaryColumn('int', { name: 'tech_id' })
  techId: number;

  @ManyToOne(() => Tech, (tech) => tech.resumeProjectTeches, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([{ name: 'tech_id' }])
  tech: Tech;

  @PrimaryColumn('int', { name: 'resume_project_id' })
  resumeProjectId: number;

  @ManyToOne(() => ResumeProject, (resumeProject) => resumeProject.resumeProjectTeches, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn([{ name: 'resume_project_id' }])
  resumeProject: ResumeProject;
}
