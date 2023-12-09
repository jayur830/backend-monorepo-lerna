import { Field, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { MonthScalar } from '@/scalars/date/month.scalar';

import { ImageMetadata } from './image-metadata.vo';

@ObjectType()
export class UpdateCompanyPayload {
  @Field({ description: '회사 ID' })
  companyId: string;

  @Field({ description: '회사 이름' })
  companyName: string;

  @Field({ nullable: true, description: '회사 로고' })
  logo: ImageMetadata | null;

  @Field(() => MonthScalar, { description: '입사일' })
  startDate: Dayjs;

  @Field(() => MonthScalar, { nullable: true, description: '퇴사일' })
  endDate: Dayjs | null;

  @Field({ nullable: true, description: '퇴사일' })
  website: string | null;

  @Field({ nullable: true, description: '회사에 대한 간단한 설명' })
  description: string | null;
}
