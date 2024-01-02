import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { DataSource, EntityManager, In } from 'typeorm';

import { ResumeCompany } from '@/entities/resume-company.entity';
import { ResumeProject } from '@/entities/resume-project.entity';
import { ResumeProjectTech } from '@/entities/resume-project-tech.entity';
import { Tech } from '@/entities/tech.entity';
import { TechLogo } from '@/enums/logo.enum';

import { CreateProjectInput, CreateProjectPayload, DeleteProjectPayload, UpdateProjectInput, UpdateProjectPayload } from './vo/project.vo';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private readonly dataSource: DataSource) {}

  async createProject(input: CreateProjectInput): Promise<CreateProjectPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      const [resumeProjectResult] = await entityManager.save(
        ResumeProject,
        [
          {
            title: input.title,
            startDate: input.startDate.format('YYYY-MM-DD'),
            endDate: input.endDate ? input.endDate.format('YYYY-MM-DD') : null,
            description: input.description,
            resumeCompany: await entityManager.findOneBy(ResumeCompany, { id: input.companyId }),
          },
        ],
        { transaction: false },
      );

      const techList = await entityManager.findBy(Tech, { name: In(input.techList) });
      const resumeProjectTechResult = await entityManager.save(
        ResumeProjectTech,
        techList.map((tech) => ({
          tech,
          resumeProject: resumeProjectResult,
        })),
        { transaction: false },
      );

      await queryRunner.commitTransaction();

      return {
        companyId: resumeProjectResult.resumeCompanyId,
        groupName: resumeProjectResult.group,
        projectId: `${resumeProjectResult.id}`,
        title: resumeProjectResult.title,
        startDate: dayjs(resumeProjectResult.startDate),
        endDate: resumeProjectResult.endDate ? dayjs(resumeProjectResult.endDate) : null,
        techList: resumeProjectTechResult.map((item) => item.tech.name as TechLogo),
        description: resumeProjectResult.description,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateProject(input: UpdateProjectInput): Promise<UpdateProjectPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      await entityManager.update(
        ResumeProject,
        {
          id: input.projectId,
          resumeCompanyId: input.companyId,
        },
        {
          title: input.title,
          startDate: input.startDate ? input.startDate.format('YYYY-MM-DD') : undefined,
          endDate: input.endDate ? input.endDate.format('YYYY-MM-DD') : undefined,
          description: input.description,
        },
      );
      const project = await entityManager.findOneBy(ResumeProject, { id: input.projectId });
      const projectResult = {
        companyId: project.resumeCompanyId,
        groupName: project.group,
        projectId: project.id,
        title: project.title,
        startDate: dayjs(project.startDate),
        endDate: project.endDate ? dayjs(project.endDate) : null,
        description: project.description,
      };

      if (input.techList && input.techList.length > 0) {
        const techList = await entityManager.findBy(Tech, { name: In(input.techList) });
        await entityManager.delete(ResumeProjectTech, { resumeProjectId: input.projectId });
        const resumeProjectTechResult = await entityManager.save(
          ResumeProjectTech,
          techList.map((tech) => ({
            tech,
            resumeProject: project,
          })),
          { transaction: false },
        );

        await queryRunner.commitTransaction();

        return {
          ...projectResult,
          projectId: `${projectResult.projectId}`,
          techList: resumeProjectTechResult.map((item) => item.tech.name as TechLogo),
        };
      } else {
        const techList = await entityManager.findBy(ResumeProjectTech, { resumeProject: project });
        await queryRunner.commitTransaction();

        return {
          ...projectResult,
          projectId: `${projectResult.projectId}`,
          techList: techList.map((item) => item.tech.name as TechLogo),
        };
      }
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteProject(projectId: number): Promise<DeleteProjectPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;

      const { resumeProjectResult, resumeProjectTechResult } = await this.delete(entityManager, projectId);

      await queryRunner.commitTransaction();

      return {
        companyId: resumeProjectResult.resumeCompanyId,
        projectId: `${resumeProjectResult.id}`,
        groupName: resumeProjectResult.group,
        title: resumeProjectResult.title,
        startDate: dayjs(resumeProjectResult.startDate),
        endDate: resumeProjectResult.endDate ? dayjs(resumeProjectResult.endDate) : null,
        techList: resumeProjectTechResult.map((item) => item.name as TechLogo),
        description: resumeProjectResult.description,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async delete(entityManager: EntityManager, projectId: number) {
    const resumeProjectResult = await entityManager.findOneBy(ResumeProject, { id: projectId });
    const resumeProjectTechResult = await entityManager
      .createQueryBuilder()
      .select(['t.name'])
      .from(Tech, 't')
      .innerJoin(ResumeProjectTech, 'pt', 't.id = pt.tech_id')
      .where('pt.resume_project_id = :projectId', { projectId })
      .getMany();
    await entityManager.delete(ResumeProjectTech, { resumeProjectId: projectId });
    await entityManager.delete(ResumeProject, { id: projectId });

    return { resumeProjectResult, resumeProjectTechResult };
  }
}
