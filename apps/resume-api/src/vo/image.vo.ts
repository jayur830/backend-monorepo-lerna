import { Field, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class Image {
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
export class CreateImageInput extends Image {}

@InputType()
export class UpdateImageInput extends PartialType(Image) {}
