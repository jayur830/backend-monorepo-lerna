import { Field, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { TechLogo } from '@/enums/logo.enum';
import { MonthScalar } from '@/scalars/date/month.scalar';

@ObjectType()
export class Project {
  @Field({ description: '프로젝트 ID' })
  projectId: number;

  @Field({ description: '프로젝트 이름' })
  title: string;

  @Field(() => MonthScalar, { description: '프로젝트 시작월' })
  startDate: Dayjs;

  @Field(() => MonthScalar, { nullable: true, description: '프로젝트 종료월 (진행중일 경우 null)' })
  endDate: Dayjs | null;

  @Field(() => [TechLogo], { description: '프로젝트에 쓰인 기술 태그 목록' })
  techList: TechLogo[];

  @Field({ description: '프로젝트 설명 MARKDOWN (성과/결과)' })
  description: string;
}
