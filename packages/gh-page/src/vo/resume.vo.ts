import { Field, ObjectType } from '@nestjs/graphql';

import { Company } from './company.vo';

@ObjectType()
export class Resume {
  @Field({ description: '이력서 제목' })
  title: string;

  @Field({ nullable: true, description: 'Github 주소' })
  github: string | null;

  @Field(() => [Company], { description: '총 경력 리스트' })
  history: Company[];
}
