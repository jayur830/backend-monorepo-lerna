import { Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { IDScalar } from '@toy/scalar';

import { CompanyInfo } from '@/vo/company-info.vo';
import { CreateImageInput, UpdateImageInput } from '@/vo/image.vo';

@ObjectType()
export class CreateCompanyPayload extends CompanyInfo {}

@InputType()
export class CreateCompanyInput extends OmitType(CompanyInfo, ['companyId', 'logo']) {
  @Field({ description: '회사 로고', nullable: true })
  logo: CreateImageInput | null;
}

@ObjectType()
export class UpdateCompanyPayload extends CompanyInfo {}

@InputType()
export class UpdateCompanyInput extends PartialType(OmitType(CompanyInfo, ['companyId', 'logo'])) {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: string;

  @Field({ description: '회사 로고', nullable: true })
  logo?: UpdateImageInput | null;
}

@ObjectType()
export class DeleteCompanyPayload extends CompanyInfo {}
