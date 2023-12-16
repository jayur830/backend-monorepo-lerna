import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateImageMetadataInput {
  @Field({ description: '이미지 src (url)', nullable: true })
  src?: string | null;

  @Field({ description: '이미지 alt', nullable: true })
  alt?: string | null;

  @Field(() => Int, { description: '이미지 width', nullable: true })
  width?: number | null;

  @Field(() => Int, { description: '이미지 height', nullable: true })
  height?: number | null;
}
