import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { MonthScalar } from '@/scalars/date/month.scalar';
import { CompanyInfo } from '@/vo/company-info.vo';
import { CreateImageInput, UpdateImageInput } from '@/vo/image.input';

@ObjectType()
export class CreateCompanyPayload extends CompanyInfo {}

@InputType()
export class CreateCompanyInput {
  @Field({ description: '회사 이름' })
  companyName: string;

  @Field({ description: '회사 로고', nullable: true })
  logo: CreateImageInput | null;

  @Field(() => MonthScalar, { description: '입사일' })
  startDate: Dayjs;

  @Field(() => MonthScalar, { description: '퇴사일', nullable: true })
  endDate: Dayjs | null;

  @Field({ description: '회사 홈페이지 주소', nullable: true })
  website: string | null;

  @Field({ description: '회사에 대한 간단한 설명', nullable: true })
  description: string | null;
}

@ObjectType()
export class UpdateCompanyPayload extends CompanyInfo {}

@InputType()
export class UpdateCompanyInput {
  @Field({ description: '회사 ID' })
  companyId: number;

  @Field({ description: '회사 이름', nullable: true })
  companyName?: string | null;

  @Field({ description: '회사 로고', nullable: true })
  logo?: UpdateImageInput | null;

  @Field(() => MonthScalar, { description: '입사일', nullable: true })
  startDate?: Dayjs | null;

  @Field(() => MonthScalar, { description: '퇴사일', nullable: true })
  endDate?: Dayjs | null;

  @Field({ description: '회사 홈페이지 주소', nullable: true })
  website?: string | null;

  @Field({ description: '회사에 대한 간단한 설명', nullable: true })
  description?: string | null;
}

@ObjectType()
export class DeleteCompanyPayload extends CompanyInfo {}
