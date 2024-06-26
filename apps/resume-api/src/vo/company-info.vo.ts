import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';
import { IDScalar, MonthScalar } from '@toy/scalar';

import { Image } from './image.vo';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class CompanyInfo {
  @Field(() => IDScalar, { description: '회사 ID' })
  companyId: string;

  @Field({ description: '회사 이름' })
  companyName: string;

  @Field({ nullable: true, description: '회사 로고' })
  logo: Image | null;

  @Field(() => MonthScalar, { description: '입사일' })
  startDate: Dayjs;

  @Field(() => MonthScalar, { nullable: true, description: '퇴사일' })
  endDate: Dayjs | null;

  @Field({ nullable: true, description: '회사 홈페이지 주소' })
  website: string | null;

  @Field({ nullable: true, description: '회사에 대한 간단한 설명' })
  description: string | null;
}
