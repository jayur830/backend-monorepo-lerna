import { Query, Resolver } from '@nestjs/graphql';

import { TechLogo } from '@/enum/logo.enum';
import { AboutMe } from '@/vo/about-me.vo';

import { InfoService } from './info.service';

@Resolver()
export class InfoResolver {
  constructor(private readonly infoService: InfoService) {}

  @Query(() => AboutMe, { description: '내 정보' })
  AboutMe_get() {
    return this.infoService.getAboutMe();
  }

  @Query(() => [TechLogo], { description: '기술 스택 목록' })
  Skills_get() {
    return this.infoService.getSkills();
  }
}
