import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class Pagination<T> {
  @Field(() => Int, { description: 'limit' })
  limit: number;

  @Field(() => Int, { description: 'offset' })
  offset: number;

  @Field(() => Int, { description: '전체 데이터 개수' })
  total: number;

  list: T[];
}
