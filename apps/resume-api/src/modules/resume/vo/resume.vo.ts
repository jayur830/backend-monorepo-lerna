import { Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';

import { Company } from './company.vo';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class ResumeInfo {
  @Field({ description: '이력서 제목' })
  title: string;

  @Field({ description: '이메일', nullable: true })
  email: string | null;

  @Field({ description: 'Github 주소', nullable: true })
  github: string | null;

  @Field({ description: '블로그 주소', nullable: true })
  blog: string | null;
}

@ObjectType()
export class Resume extends ResumeInfo {
  @Field(() => [Company], { description: '회사 경력 리스트' })
  companyList: Company[];
}

@ObjectType()
export class CreateResumePayload extends ResumeInfo {}

@InputType()
export class CreateResumeInput extends ResumeInfo {}

@ObjectType()
export class UpdateResumePayload extends ResumeInfo {}

@InputType()
export class UpdateResumeInput extends PartialType(ResumeInfo) {}

@ObjectType()
export class DeleteResumePayload extends ResumeInfo {}
