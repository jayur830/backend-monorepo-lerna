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
SELECT
  t.name,
  t.type,
  ts.score,
  t.logo_url AS logoUrl
FROM tech_score ts
JOIN tech t
ON t.id = ts.tech_id
WHERE ts.user_id = ?
    `;
    const data = await this.dataSource.query<TechProjection[]>(query, [userId]);

    return data.reduce((result, item) => {
      const techTypeIndex = result.findIndex((tech) => tech.type === item.type);

      if (techTypeIndex !== -1) {
        return result.map((tech, i) => {
          if (techTypeIndex === i) {
            return {
              ...tech,
              list: [
                ...tech.list,
                {
                  value: item.name,
                  score: item.score,
                  logoUrl: item.logoUrl,
                },
              ].sort(),
            };
          }

          return tech;
        });
      }

      return [
        ...result,
        {
          type: item.type,
          list: [
            {
              value: item.name,
              score: item.score,
              logoUrl: item.logoUrl,
            },
          ],
        },
      ].sort((a, b) => (a.type < b.type ? -1 : 1));
    }, []);
  }
}
