import { Field, ObjectType } from '@nestjs/graphql';

import { CompanyInfo } from '@/vo/company-info.vo';

import { ProjectGroup } from './project-group.vo';

@ObjectType()
export class Company extends CompanyInfo {
  @Field(() => [ProjectGroup], { description: '프로젝트 이력 리스트' })
  projectList: ProjectGroup[];
}
