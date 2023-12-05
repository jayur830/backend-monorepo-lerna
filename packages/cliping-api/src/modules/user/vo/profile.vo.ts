import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '프로필 상세' })
export class Profile {
  @Field(() => String, { description: '소개', nullable: true })
  description: string | null;

  @Field(() => String, { description: '프로필 부제목', nullable: true })
  subTitle: string | null;

  @Field(() => String, { description: '커버 사진 URL', nullable: true })
  backgroundImageUrl: string | null;

  @Field(() => String, { description: '프로필 사진 URL', nullable: true })
  profileImageUrl: string | null;

  @Field(() => String, { description: '인스타그램 URL', nullable: true })
  instagramUrl: string | null;
}
