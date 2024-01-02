import { Field, InputType, IntersectionType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { IDScalar } from '@toy/scalar';

import { Project } from '@/vo/project.vo';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
class ProjectListGroup {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}

@ObjectType()
export class CreateProjectPayload extends Project {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}

@InputType()
export class CreateProjectInput extends IntersectionType(ProjectListGroup, OmitType(Project, ['projectId'])) {}

@ObjectType()
export class UpdateProjectPayload extends Project {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}

@InputType()
export class UpdateProjectInput extends IntersectionType(ProjectListGroup, PartialType(OmitType(Project, ['projectId']))) {
  @Field({ description: '프로젝트 ID' })
  projectId: number;
}

@ObjectType()
export class DeleteProjectPayload extends Project {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: number;

  @Field({ nullable: true, description: '팀 또는 소속 서비스 이름 (없을 경우 null)' })
  groupName: string | null;
}
