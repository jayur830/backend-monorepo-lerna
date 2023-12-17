import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { TechLogo } from '@/enums/logo.enum';
import { MonthScalar } from '@/scalars/date/month.scalar';
import { Project } from '@/vo/project.vo';

@ObjectType()
export class CreateProjectPayload extends Project {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}

@InputType()
export class CreateProjectInput {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;

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

@ObjectType()
export class UpdateProjectPayload extends Project {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}

@InputType()
export class UpdateProjectInput {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;

  @Field({ description: '프로젝트 ID' })
  projectId: number;

  @Field({ description: '프로젝트 이름', nullable: true })
  title?: string | null;

  @Field(() => MonthScalar, { description: '프로젝트 시작월', nullable: true })
  startDate?: Dayjs | null;

  @Field(() => MonthScalar, { description: '프로젝트 종료월 (진행중일 경우 null)', nullable: true })
  endDate?: Dayjs | null;

  @Field(() => [TechLogo], { description: '프로젝트에 쓰인 기술 태그 목록', nullable: true })
  techList?: TechLogo[] | null;

  @Field({ description: '프로젝트 설명 MARKDOWN (성과/결과)', nullable: true })
  description?: string | null;
}

@ObjectType()
export class DeleteProjectPayload extends Project {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}
