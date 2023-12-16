import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { omit } from 'lodash';
import { FirebaseUser } from '@toy/firebase/types';
import { DataSource, Repository } from 'typeorm';

import { ResumeInfo } from '@/entities/resume-info.entity';

import { ResumeProjection } from './types/resume-projection.interface';
import { Company } from './vo/company.vo';
import { CreateResumeInfoInput, CreateResumeInfoPayload, DeleteResumeInfoPayload, ResumeInfo as ResumeInfoVO, UpdateResumeInfoInput, UpdateResumeInfoPayload } from './vo/resume.vo';

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ResumeInfo) private readonly resumeInfoRepository: Repository<ResumeInfo>,
  ) {}

  async getResumeInfo(userId: string): Promise<ResumeInfoVO> {
    const [result] = await this.resumeInfoRepository.find({ select: ['title', 'email', 'github', 'blog'], where: { userId } });
    return result;
  }

  async getCompanyList(userId: string): Promise<Company[]> {
    const query = `
SELECT
  c.id AS companyId,
  c.name AS companyName,
  c.start_date AS companyStartDate,
  c.end_date AS companyEndDate,
  c.website AS companyWebsiteUrl,
  c.description AS companyDescription,
  l.src AS companyLogoSrc,
  l.alt AS companyLogoAlt,
  l.width AS companyLogoWidth,
  l.height AS companyLogoHeight,
  p.\`group\` AS projectGroup,
  p.id AS projectId,
  p.title AS projectTitle,
  p.start_date AS projectStartDate,
  p.end_date AS projectEndDate,
  p.description AS projectDescription,
  rpt.resume_project_id AS resumeProjectId,
  GROUP_CONCAT(rpt.name) AS projectTechList
FROM resume_company c
JOIN resume_info i
ON i.id = c.resume_info_id
JOIN company_logo l
ON c.logo_id = l.id
JOIN resume_project p
ON c.id = p.resume_company_id
LEFT JOIN (
  SELECT
    pt.resume_project_id,
    t.name
  FROM resume_project_tech pt
  JOIN tech t
  ON t.id = pt.tech_id
) rpt
ON rpt.resume_project_id = p.id
WHERE i.user_id = ?
GROUP BY
  c.id,
  c.name,
  c.start_date,
  c.end_date,
  c.website,
  c.description,
  p.\`group\`,
  p.id,
  p.title,
  p.start_date,
  p.end_date,
  p.description,
  rpt.resume_project_id
ORDER BY
  c.start_date DESC,
  p.start_date DESC;
      `;
    const result = await this.dataSource.query<ResumeProjection[]>(query, [userId]);

    return result.reduce((result, item) => {
      const companyIndex = result.findIndex((company) => company.companyId === item.companyId);

      const project = {
        projectId: item.projectId,
        title: item.projectTitle,
        startDate: dayjs(item.projectStartDate),
        endDate: item.projectEndDate ? dayjs(item.projectEndDate) : null,
        techList: item.projectTechList.split(','),
        description: item.projectDescription,
      };

      if (companyIndex !== -1) {
        return result.map((company, i) => {
          if (companyIndex === i) {
            const groupIndex = company.projectList.findIndex((group) => group.groupName === item.projectGroup);

            if (groupIndex !== -1) {
              return {
                ...company,
                projectList: company.projectList.map((group, i) => {
                  if (groupIndex === i) {
                    return {
                      ...group,
                      list: [...group.list, project].sort((a, b) => (a.startDate > b.startDate ? -1 : 1)),
                    };
                  }

                  return group;
                }),
              };
            }

            return {
              ...company,
              projectList: [
                ...company.projectList,
                {
                  groupName: item.projectGroup,
                  list: [project],
                },
              ].sort((a, b) => (a.list?.[0]?.startDate > b.list?.[0]?.startDate ? -1 : 1)),
            };
          }

          return company;
        });
      }

      return [
        ...result,
        {
          companyId: item.companyId,
          companyName: item.companyName,
          logo: {
            src: item.companyLogoSrc,
            alt: item.companyLogoAlt,
            width: item.companyLogoWidth,
            height: item.companyLogoHeight,
          },
          startDate: dayjs(item.companyStartDate),
          endDate: item.companyEndDate ? dayjs(item.companyEndDate) : null,
          description: item.companyDescription,
          projectList: [
            {
              groupName: item.projectGroup,
              list: [project],
            },
          ],
        },
      ];
    }, []);
  }

  async createResume(user: FirebaseUser, input: CreateResumeInfoInput): Promise<CreateResumeInfoPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      const [result] = await entityManager.save(ResumeInfo, [{ ...input, userId: user.uid }], { transaction: false });
      await queryRunner.commitTransaction();
      return omit(result, 'resumeCompanies');
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateResume(user: FirebaseUser, input: UpdateResumeInfoInput): Promise<UpdateResumeInfoPayload> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const entityManager = queryRunner.manager;
      await entityManager.update(ResumeInfo, { userId: user.uid }, omit(input, 'userId'));
      const result = await entityManager.findOneBy(ResumeInfo, { userId: user.uid });
      await queryRunner.commitTransaction();
      return omit(result, 'resumeCompanies');
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
