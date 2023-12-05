import { Field, InputType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { MonthScalar } from '@/scalars/date/month.scalar';

import { UpdateImageMetadataInput } from './update-image-metadata.input';

@InputType()
export class UpdateCompanyInput {
  @Field({ description: '회사 ID' })
  companyId: string;

  @Field({ description: '회사 이름' })
  companyName: string;

  @Field({ nullable: true, description: '회사 로고' })
  logo?: UpdateImageMetadataInput | null;

  @Field(() => MonthScalar, { nullable: true, description: '입사일' })
  startDate?: Dayjs | null;

  @Field(() => MonthScalar, { nullable: true, description: '퇴사일' })
  endDate?: Dayjs | null;

  @Field({ nullable: true, description: '회사 홈페이지 주소' })
  website?: string | null;

  @Field({ nullable: true, description: '회사에 대한 간단한 설명' })
  description?: string | null;
}
