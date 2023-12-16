import { UseGuards } from '@nestjs/common';
import { Args, Int, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';

import { UserService } from './user.service';
import { FollowPagination } from './vo/follow-pagination.vo';
import { Me } from './vo/me.vo';
import { User } from './vo/user.vo';

@Resolver(() => User)
export class UserQueryResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => Me, { description: '로그인한 유저의 개인 정보' })
  me(@GqlUserContext() user: FirebaseUser): Promise<Me> {
    return this.userService.getMe(user);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, {
    description: `유저 상세 정보

- throw
\`\`\`json
// ID에 대한 유저가 없을 경우
{
  "message": "해당하는 유저가 없습니다.",
  "extensions": {
    "code": "USER_NOT_EXISTS"
  }
}
\`\`\``,
  })
  user(@Args({ name: 'id', type: () => String }) id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => FollowPagination, { description: '팔로워 목록' })
  followerList(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'limit', type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): Promise<FollowPagination> {
    return this.userService.getFollowerList(user, limit, offset);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => FollowPagination, { description: '팔로잉 목록' })
  followingList(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'limit', type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args({ name: 'offset', type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): Promise<FollowPagination> {
    return this.userService.getFollowingList(user, limit, offset);
  }
}
