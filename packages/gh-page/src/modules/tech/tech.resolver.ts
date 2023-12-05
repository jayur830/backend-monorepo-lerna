import { Args, Query, Resolver } from '@nestjs/graphql';

import { TechLogo } from '@/enum/logo.enum';

@Resolver()
export class TechResolver {
  @Query(() => [TechLogo], { description: '기술 로고 리스트' })
  TechList_get(@Args({ name: 'keyword', type: () => String, nullable: true }) keyword?: string) {
    return Object.entries(TechLogo)
      .map(([, tech]) => tech)
      .filter((value) => value.toLocaleLowerCase().includes((keyword || '').replace(/[,. ]/g, '').toLocaleLowerCase()));
  }
}
