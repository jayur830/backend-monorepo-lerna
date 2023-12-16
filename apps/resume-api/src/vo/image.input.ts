import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateImageInput {
  @Field({ description: '이미지 src (url)' })
  src: string;

  @Field({ description: '이미지 alt' })
  alt: string;

  @Field(() => Int, { description: '이미지 width' })
  width: number;

  @Field(() => Int, { description: '이미지 height' })
  height: number;
}

@InputType()
export class UpdateImageInput {
  @Field({ description: '이미지 src (url)', nullable: true })
  src: string | null;

  @Field({ description: '이미지 alt', nullable: true })
  alt: string | null;

  @Field(() => Int, { description: '이미지 width', nullable: true })
  width: number | null;

  @Field(() => Int, { description: '이미지 height', nullable: true })
  height: number | null;
}
