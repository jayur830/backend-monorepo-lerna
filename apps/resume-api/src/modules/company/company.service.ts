import { Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DataSource } from 'typeorm';

import { CompanyLogo } from '@/entities/company-logo.entity';
import { ResumeCompany } from '@/entities/resume-company.entity';
import { ResumeInfo } from '@/entities/resume-info.entity';
import { ProjectService } from '@/modules/project/project.service';

import { CreateCompanyInput, CreateCompanyPayload, DeleteCompanyPayload, UpdateCompanyInput, UpdateCompanyPayload } from './vo/company.vo';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly projectService: ProjectService,
  ) {}

  async createCompany(userId: string, input: CreateCompanyInput): Promise<CreateCompanyPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      const resumeInfo = await entityManager.findOneBy(ResumeInfo, { userId });
      const [companyLogoResult] = await entityManager.save(CompanyLogo, [input.logo]);
      const [companyInfoResult] = await entityManager.save(
        ResumeCompany,
        [
          {
            name: input.companyName,
            startDate: dayjs(input.startDate).format('YYYY-MM-DD'),
            endDate: input.endDate ? dayjs(input.endDate).format('YYYY-MM-DD') : null,
            website: input.website,
            description: input.description,
            logoId: companyLogoResult.id,
            resumeInfoId: resumeInfo.id,
          },
        ],
        { transaction: false },
      );

      await queryRunner.commitTransaction();

      return {
        companyId: `${companyInfoResult.id}`,
        companyName: companyInfoResult.name,
        logo: companyLogoResult,
        startDate: dayjs(companyInfoResult.startDate),
        endDate: companyInfoResult.endDate ? dayjs(companyInfoResult.endDate) : null,
        website: companyInfoResult.website,
        description: companyInfoResult.description,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateCompany(userId: string, input: UpdateCompanyInput): Promise<UpdateCompanyPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      const resumeInfo = await entityManager.findOneBy(ResumeInfo, { userId });
      await entityManager.update(
        ResumeCompany,
        { id: input.companyId, resumeInfoId: resumeInfo.id },
        {
          name: input.companyName,
          startDate: input.startDate ? dayjs(input.startDate).format('YYYY-MM-DD') : undefined,
          endDate: input.endDate ? dayjs(input.endDate).format('YYYY-MM-DD') : null,
          website: input.website,
          description: input.description,
        },
      );
      const companyInfoResult = await entityManager.findOneBy(ResumeCompany, { id: +input.companyId, resumeInfoId: resumeInfo.id });
      if (input.logo) {
        await entityManager.update(CompanyLogo, { id: companyInfoResult.logoId }, input.logo);
      }
      const companyLogoResult = await entityManager.findOneBy(CompanyLogo, { id: companyInfoResult.logoId });

      await queryRunner.commitTransaction();

      return {
        companyId: `${companyInfoResult.id}`,
        companyName: companyInfoResult.name,
        logo: companyLogoResult,
        startDate: dayjs(companyInfoResult.startDate),
        endDate: companyInfoResult.endDate ? dayjs(companyInfoResult.endDate) : null,
        website: companyInfoResult.website,
        description: companyInfoResult.description,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCompany(companyId: number): Promise<DeleteCompanyPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = this.dataSource.manager;

      const company = await entityManager.findOne(ResumeCompany, {
        relations: ['logo', 'resumeProjects'],
        where: { id: companyId },
      });
      await Promise.all(
        company.resumeProjects.map(async (project) => {
          await this.projectService.delete(entityManager, project.id);
        }),
      );
      await queryRunner.commitTransaction();

      await queryRunner.startTransaction();
      await entityManager.delete(ResumeCompany, { id: companyId });
      await queryRunner.commitTransaction();

      await queryRunner.startTransaction();
      await entityManager.delete(CompanyLogo, { id: company.logo.id });
      await queryRunner.commitTransaction();

      return {
        companyId: `${company.id}`,
        companyName: company.name,
        logo: company.logo,
        startDate: dayjs(company.startDate),
        endDate: company.endDate ? dayjs(company.endDate) : null,
        website: company.website,
        description: company.description,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
