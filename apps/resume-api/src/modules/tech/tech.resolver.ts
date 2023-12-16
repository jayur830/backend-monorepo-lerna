import { Args, Query, Resolver } from '@nestjs/graphql';

import { TechLogo } from '@/enums/logo.enum';

import { TechService } from './tech.service';
import { Skill } from './vo/skill.vo';

@Resolver()
export class TechResolver {
  constructor(private readonly techService: TechService) {}

  @Query(() => [TechLogo], { description: '모든 기술 목록 조회' })
  techList(@Args({ name: 'keyword', type: () => String, nullable: true }) keyword: string | null): Promise<TechLogo[]> {
    return this.techService.getTechList(keyword);
  }

  @Query(() => [Skill], { description: '기술 스택' })
  skillList(@Args({ name: 'userId', type: () => String, description: '유저 ID' }) userId: string): Promise<Skill[]> {
    return this.techService.getSkillList(userId);
  }
}
