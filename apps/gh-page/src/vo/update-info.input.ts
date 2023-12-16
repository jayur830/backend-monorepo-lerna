import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateInfoInput {
  @Field({ nullable: true, description: '이력서 제목' })
  title?: string | null;

  @Field({ nullable: true, description: 'Github 주소' })
  github?: string | null;
}
