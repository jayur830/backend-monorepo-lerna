import { Field, Int, ObjectType } from '@nestjs/graphql';

import { TechLogo } from '@/enums/logo.enum';

import { TechProjection } from '../types/tech-projection.interface';

@ObjectType()
class Tech {
  @Field(() => TechLogo, { description: '기술 스택 이름' })
  value: TechLogo;

  @Field(() => Int, { description: '기술 숙련도' })
  score: number;

  @Field(() => String, { description: '로고 이미지 URL' })
  logoUrl: string;
}

@ObjectType()
export class Skill {
  @Field(() => String, { description: '카테고리 (lang: 프로그래밍 언어, fe: 프론트엔드, be: 백엔드, tool: 툴, db: 데이터베이스, infra: 인프라, cloud: 클라우드 서비스, cowork: 협업 툴)' })
  type: TechProjection['type'];

  @Field(() => [Tech], { description: '기술 스택 목록' })
  list: Tech[];
}
