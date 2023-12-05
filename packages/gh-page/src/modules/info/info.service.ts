import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';

import { ResumeHistoryDetail } from '@/entities/resume_history_detail.entity';
import { TechLogo } from '@/enum/logo.enum';
import { AboutMe as AboutMeVO } from '@/vo/about-me.vo';

import { AboutMeProjection } from './types/about-me-projection.interface';

@Injectable()
export class InfoService {
  private readonly logger = new Logger(InfoService.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ResumeHistoryDetail) private readonly resumeHistoryDetailRepository: Repository<ResumeHistoryDetail>,
  ) {}

  async getAboutMe(): Promise<AboutMeVO> {
    const [data] = await this.dataSource.query<AboutMeProjection[]>(`
      SELECT
        a.\`name\`,
        u.\`email\`,
        DATE_FORMAT(a.\`birth\`, '%Y-%m-%d') AS 'birth',
        a.\`github\`,
        a.\`blog\`
      FROM \`user\` u
      JOIN \`about_me\` a
      ON u.\`id\` = a.\`user_id\`
      LIMIT 1;
    `);
    return {
      ...data,
      birth: dayjs(data.birth),
    };
  }

  async getSkills(): Promise<TechLogo[]> {
    const data = await this.resumeHistoryDetailRepository.find({ select: ['techList'] });
    return [...new Set<TechLogo>(data.reduce((result, { techList }) => [...result, ...techList.split(',')], []))].sort();
  }
}
