import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';

import { Company } from './company.vo';

@ObjectType()
export class Resume {
  @Field({ description: '이력서 제목' })
  title: string;

  @Field({ description: '이메일', nullable: true })
  email: string | null;

  @Field({ description: 'Github 주소', nullable: true })
  github: string | null;

  @Field({ description: '블로그 주소', nullable: true })
  blog: string | null;

  @Field(() => [Company], { description: '회사 경력 리스트' })
  companyList: Company[];
}

@ObjectType()
export class ResumeInfo extends OmitType(Resume, ['companyList']) {}

@ObjectType()
export class CreateResumeInfoPayload extends OmitType(Resume, ['companyList']) {}

@InputType()
export class CreateResumeInfoInput {
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
export class UpdateResumeInfoPayload extends OmitType(Resume, ['companyList']) {}

@InputType()
export class UpdateResumeInfoInput {
  @Field({ description: '이력서 제목', nullable: true })
  title: string | null;

  @Field({ description: '이메일', nullable: true })
  email: string | null;

  @Field({ description: 'Github 주소', nullable: true })
  github: string | null;

  @Field({ description: '블로그 주소', nullable: true })
  blog: string | null;
}

@ObjectType()
export class DeleteResumeInfoPayload extends OmitType(Resume, ['companyList']) {}
