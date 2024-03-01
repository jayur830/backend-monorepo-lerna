import { Field, ObjectType, PickType } from '@nestjs/graphql';

import { Paginated } from '@/utils/paginated.util';

import { Follow } from './follow.vo';

@ObjectType({ description: '팔로잉/팔로워 데이터 Pagination' })
export class FollowPagination extends Paginated(Follow) {
  @Field(() => [Follow], { description: '팔로잉/팔로워 목록' })
  list: Follow[];
}

@ObjectType()
export class FollowPaginationOffsetLimit extends PickType(FollowPagination, [
  'limit',
  'offset',
]) {}
