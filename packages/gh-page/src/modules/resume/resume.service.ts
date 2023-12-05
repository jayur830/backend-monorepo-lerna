import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { omit, pick } from 'lodash';
import { readFile } from 'fs';
import { DataSource, Repository } from 'typeorm';

import { CompanyLogo } from '@/entities/company_logo.entity';
import { ResumeHistory } from '@/entities/resume_history.entity';
import { ResumeHistoryDetail } from '@/entities/resume_history_detail.entity';
import { ResumeInfo } from '@/entities/resume_info.entity';
import { CreateCompanyInput } from '@/vo/create-company.input';
import { CreateCompanyPayload } from '@/vo/create-company.payload';
import { CreateHistoryDetailInput } from '@/vo/create-history-detail.input';
import { CreateHistoryDetailPayload } from '@/vo/create-history-detail.payload';
import { Resume } from '@/vo/resume.vo';
import { UpdateCompanyInput } from '@/vo/update-company.input';
import { UpdateCompanyPayload } from '@/vo/update-company.payload';
import { UpdateHistoryDetailInput } from '@/vo/update-history-detail.input';
import { UpdateHistoryDetailPayload } from '@/vo/update-history-detail.payload';
import { UpdateInfoInput } from '@/vo/update-info.input';
import { UpdateInfoPayload } from '@/vo/update-info.payload';

import { ResumeProjection } from './types/resume-projection.interface';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ResumeInfo) private readonly resumeInfoRepository: Repository<ResumeInfo>,
    @InjectRepository(ResumeHistory) private readonly resumeHistoryRepository: Repository<ResumeHistory>,
    @InjectRepository(ResumeHistoryDetail) private readonly resumeHistoryDetailRepository: Repository<ResumeHistoryDetail>,
    @InjectRepository(CompanyLogo) private readonly companyLogoRepository: Repository<CompanyLogo>,
  ) {}

  async findOne(): Promise<Resume> {
    const query = await new Promise<string>((resolve) => {
      readFile('./src/modules/resume/resume.sql', 'utf8', (_, data) => {
        resolve(data);
      });
    });
    const result = await this.dataSource.query<ResumeProjection[]>(query);

    return result.reduce(
      (resume, item) => {
        const companyIndex = resume.history.findIndex((company) => company.companyId === item.historyId);
        const careerValue = {
          careerId: item.historyDetailId,
          name: item.projectName,
          startDate: dayjs(item.projectStartDate),
          endDate: item.projectEndDate ? dayjs(item.projectEndDate) : null,
          techList: (item.techList || '').split(',').filter((tech) => tech),
          description: item.historyDetailDescription,
        };

        if (companyIndex !== -1) {
          return {
            ...pick(item, 'title', 'github'),
            history: resume.history.map((company, i) => {
              if (companyIndex === i) {
                const groupIndex = company.careers.findIndex((career) => career.groupName === item.historyDetailGroup);

                if (groupIndex !== -1) {
                  return {
                    ...company,
                    careers: company.careers.map((career, j) => {
                      if (groupIndex === j) {
                        return {
                          ...career,
                          list: [...career.list, careerValue],
                        };
                      }

                      return career;
                    }),
                  };
                }

                return {
                  ...company,
                  careers: [
                    ...company.careers,
                    {
                      groupName: item.historyDetailGroup,
                      list: [careerValue],
                    },
                  ],
                };
              }

              return company;
            }),
          };
        }

        return {
          ...pick(item, 'title', 'github'),
          history: [
            ...resume.history,
            {
              ...pick(item, 'companyName', 'website'),
              companyId: item.historyId,
              logo: {
                ...pick(item, 'src', 'alt'),
                width: item.logoWidth,
                height: item.logoHeight,
              },
              startDate: dayjs(item.companyStartDate),
              endDate: item.companyEndDate ? dayjs(item.companyEndDate) : null,
              description: item.companyDescription,
              careers: [
                {
                  groupName: item.historyDetailGroup,
                  list: [careerValue],
                },
              ],
            },
          ],
        };
      },
      { history: [] },
    );
  }

  async updateInfo(input: UpdateInfoInput): Promise<UpdateInfoPayload> {
    if (Object.keys(input).length === 0) {
      const result = await this.resumeInfoRepository.findOne({ select: ['title', 'github'], where: { id: 1 } });
      return pick(result, 'title', 'github');
    } else {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const repository = queryRunner.manager.withRepository(this.resumeInfoRepository);
        await repository.update(1, input);
        const result = await repository.findOne({ select: ['title', 'github'], where: { id: 1 } });
        await queryRunner.commitTransaction();
        return pick(result, 'title', 'github');
      } catch (error) {
        this.logger.error(error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async createCompanyInfo(input: CreateCompanyInput): Promise<CreateCompanyPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resumeInfoRepository = queryRunner.manager.withRepository(this.resumeInfoRepository);
      const resumeHistoryRepository = queryRunner.manager.withRepository(this.resumeHistoryRepository);
      const resumeInfo = await resumeInfoRepository.findOneBy({ id: 1 });
      const result = await resumeHistoryRepository.save({
        ...input,
        startDate: input.startDate ? input.startDate.format('YYYY-MM') : null,
        endDate: input.endDate ? input.endDate.format('YYYY-MM') : null,
        resumeInfo,
        logo: input.logo,
      });
      await queryRunner.commitTransaction();
      return {
        ...result,
        startDate: dayjs(result.startDate),
        endDate: result.endDate ? dayjs(result.endDate) : null,
        companyId: `${result.id}`,
        logo: result.logo || null,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateCompanyInfo(input: UpdateCompanyInput): Promise<UpdateCompanyPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.withRepository(this.resumeHistoryRepository);
      await repository.update(input.companyId, {
        ...omit(input, 'companyId'),
        startDate: input.startDate ? input.startDate.format('YYYY-MM') : null,
        endDate: input.endDate ? input.endDate.format('YYYY-MM') : null,
        logo: input.logo,
      });
      const result = await repository.findOneBy({ id: +input.companyId });
      await queryRunner.commitTransaction();
      return {
        ...result,
        startDate: dayjs(result.startDate),
        endDate: result.endDate ? dayjs(result.endDate) : null,
        companyId: input.companyId,
        logo: result.logo,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteCompanyInfo(companyId: string): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resumeHistoryRepository = queryRunner.manager.withRepository(this.resumeHistoryRepository);
      const companyLogoRepository = queryRunner.manager.withRepository(this.companyLogoRepository);
      const resumeHistory = await resumeHistoryRepository.findOneBy({ id: +companyId });
      await resumeHistoryRepository.delete({ id: +companyId });
      await companyLogoRepository.delete({ id: resumeHistory.logo.id });
      await queryRunner.commitTransaction();
      return companyId;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async createHistoryDetail(input: CreateHistoryDetailInput): Promise<CreateHistoryDetailPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resumeInfoRepository = queryRunner.manager.withRepository(this.resumeInfoRepository);
      const resumeHistoryDetailRepository = queryRunner.manager.withRepository(this.resumeHistoryDetailRepository);
      const history = await resumeInfoRepository.findOneBy({ id: +input.companyId });
      const result = await resumeHistoryDetailRepository.save({
        ...omit(input, 'companyId'),
        startDate: input.startDate.format('YYYY-MM'),
        endDate: input.endDate ? input.endDate.format('YYYY-MM') : null,
        techList: input.techList.join(','),
        history,
      });
      await queryRunner.commitTransaction();
      return {
        ...omit(result, 'id'),
        techList: result.techList.split(',').filter((tech) => tech),
        startDate: dayjs(result.startDate),
        endDate: result.endDate ? dayjs(result.endDate) : null,
        historyDetailId: result.id,
      };
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateHistoryDetail(input: UpdateHistoryDetailInput): Promise<UpdateHistoryDetailPayload> {
    if (Object.keys(input).length === 1) {
      const result = await this.resumeHistoryDetailRepository.findOneBy({ id: +input.historyDetailId });
      return {
        ...omit(result, 'id'),
        techList: result.techList.split(',').filter((tech) => tech),
        startDate: dayjs(result.startDate),
        endDate: result.endDate ? dayjs(result.endDate) : null,
        historyDetailId: result.id,
      };
    } else {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const repository = queryRunner.manager.withRepository(this.resumeHistoryDetailRepository);
        await repository.update(input.historyDetailId, {
          ...omit(input, 'historyDetailId'),
          startDate: input.startDate ? input.startDate.format('YYYY-MM') : null,
          endDate: input.endDate ? input.endDate.format('YYYY-MM') : null,
          techList: input.techList ? input.techList.join(',') : undefined,
        });
        const result = await repository.findOneBy({ id: +input.historyDetailId });
        await queryRunner.commitTransaction();
        return {
          ...omit(result, 'id'),
          techList: result.techList.split(',').filter((tech) => tech),
          startDate: dayjs(result.startDate),
          endDate: result.endDate ? dayjs(result.endDate) : null,
          historyDetailId: result.id,
        };
      } catch (error) {
        this.logger.error(error);
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }

  async deleteHistoryDetail(historyDetailId: string): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository = queryRunner.manager.withRepository(this.resumeHistoryDetailRepository);
      await repository.delete({ id: +historyDetailId });
      await queryRunner.commitTransaction();
      return historyDetailId;
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
