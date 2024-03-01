import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Info,
  Int,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';
import { GraphQLResolveInfo } from 'graphql';

import { FollowerService } from './follower.service';
import { Follow } from './vo/follow.vo';
import {
  FollowPagination,
  FollowPaginationOffsetLimit,
} from './vo/follow-pagination.vo';

@Resolver(() => FollowPagination)
export class FollowerResolver {
  private readonly logger = new Logger(FollowerResolver.name);

  constructor(private readonly followerService: FollowerService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => FollowPagination, { description: '팔로워 목록' })
  followerList(
    @Args({ name: 'limit', type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): FollowPaginationOffsetLimit {
    return { limit, offset };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => FollowPagination, { description: '팔로잉 목록' })
  followingList(
    @Args({ name: 'limit', type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): FollowPaginationOffsetLimit {
    return { limit, offset };
  }

  @ResolveField()
  total(
    @Info() info: GraphQLResolveInfo,
    @GqlUserContext() user: FirebaseUser,
  ): number | Promise<number> {
    switch (info.path.prev.key) {
      case 'followerList':
        return this.followerService.getFollowerListTotal(user.uid);
      case 'followingList':
        return this.followerService.getFollowingListTotal(user.uid);
      default:
        return 0;
    }
  }

  @ResolveField()
  list(
    @Info() info: GraphQLResolveInfo,
    @GqlUserContext() user: FirebaseUser,
  ): Follow[] | Promise<Follow[]> {
    const limit = info.variableValues.limit as number | undefined;
    const offset = info.variableValues.offset as number | undefined;
    console.log(limit, offset);
    switch (info.path.prev.key) {
      case 'followerList':
        return this.followerService.getFollowerList(
          user,
          limit ?? 10,
          offset ?? 0,
        );
      case 'followingList':
        return this.followerService.getFollowingList(
          user,
          limit ?? 10,
          offset ?? 0,
        );
      default:
        return [];
    }
  }
}
