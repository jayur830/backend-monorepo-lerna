import { Field, ObjectType } from '@nestjs/graphql';

import { CareerItem } from './career-item.vo';

@ObjectType()
export class Career {
  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;

  @Field(() => [CareerItem], { description: '수행한 프로젝트 경력' })
  list: CareerItem[];
}
