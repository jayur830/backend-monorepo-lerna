import { Field, ObjectType } from '@nestjs/graphql';

import { Project } from '@/vo/project.vo';

@ObjectType()
export class ProjectGroup {
  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;

  @Field(() => [Project], { description: '수행한 프로젝트 이력' })
  list: Project[];
}
