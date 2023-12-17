import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  limit: number;
  offset: number;
  total: number;
  list: T[];
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => Int, { description: 'limit' })
    limit: number;

    @Field(() => Int, { description: 'offset' })
    offset: number;

    @Field(() => Int, { description: 'total' })
    total: number;

    @Field(() => [classRef], { description: '페이지네이션 아이템 목록' })
    list: T[];
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
