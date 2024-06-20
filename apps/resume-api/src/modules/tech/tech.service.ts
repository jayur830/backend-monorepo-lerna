import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';

import { Tech } from '@/entities/tech.entity';
import { TechLogo } from '@/enums/logo.enum';

import { TechProjection } from './types/tech-projection.interface';
import { Skill } from './vo/skill.vo';

@Injectable()
export class TechService {
  private readonly logger = new Logger(TechService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Tech) private readonly techRepository: Repository<Tech>,
  ) {}

  async getTechList(keyword: string | null): Promise<TechLogo[]> {
    const result = await this.techRepository.find({ select: ['name'], where: keyword ? { keywords: Like(`%${keyword.toLocaleLowerCase()}%`) } : undefined });
    return result.map((item) => item.name as TechLogo);
  }

  async getSkillList(userId: string): Promise<Skill[]> {
    const query = `
SELECT DISTINCT
  t.name,
  t.\`type\`
FROM resume_project_tech pt
JOIN tech t
ON pt.tech_id = t.id
JOIN resume_project p
ON pt.resume_project_id = p.id
JOIN resume_company c
ON p.resume_company_id = c.id
JOIN resume_info i
ON c.resume_info_id = i.id
WHERE i.user_id = ?
    `;
    const data = await this.dataSource.query<TechProjection[]>(query, [userId]);

    return data.reduce((result, item) => {
      const techTypeIndex = result.findIndex((tech) => tech.type === item.type);

      if (techTypeIndex !== -1) {
        return result.map((tech, i) => {
          if (techTypeIndex === i) {
            return {
              ...tech,
              list: [...tech.list, item.name].sort(),
            };
          }

          return tech;
        });
      }

      return [
        ...result,
        {
          type: item.type,
          list: [item.name],
        },
      ].sort((a, b) => (a.type < b.type ? -1 : 1));
    }, []);
  }
}
