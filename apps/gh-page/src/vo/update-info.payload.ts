import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UpdateInfoPayload {
  @Field({ description: '이력서 제목' })
  title: string;

  @Field({ nullable: true, description: 'Github 주소' })
  github: string | null;
}
