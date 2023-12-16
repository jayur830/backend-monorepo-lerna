import { Field, ObjectType } from '@nestjs/graphql';
import { Dayjs } from 'dayjs';

import { DateScalar } from '@/scalars/date/date.scalar';

@ObjectType()
export class AboutMe {
  @Field({ description: '이름' })
  name: string;

  @Field(() => DateScalar, { description: '생년월일' })
  birth: Dayjs;

  @Field({ description: '이메일' })
  email: string;

  @Field({ description: 'Github URL', nullable: true })
  github: string | null;

  @Field({ description: '블로그 URL', nullable: true })
  blog: string | null;
}
