import { Field, ObjectType } from '@nestjs/graphql';

import { Pagination } from '@/interfaces/pagination/pagination.abstract';

import { Follow } from './follow.vo';

@ObjectType({ description: '팔로잉/팔로워 데이터 Pagination' })
export class FollowPagination extends Pagination<Follow> {
  @Field(() => [Follow], { description: '팔로잉/팔로워 목록' })
  list: Follow[];
}
