import { UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, ResolveField, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';
import { GraphQLResolveInfo } from 'graphql';

import { FollowerService } from '@/modules/follower/follower.service';
import { ProfileService } from '@/modules/profile/profile.service';

import { UserService } from './user.service';
import { Me } from './vo/me.vo';
import { Profile as ProfileVO } from './vo/profile.vo';
import { User, UserSummary } from './vo/user.vo';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
    private readonly followerService: FollowerService,
  ) {}

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
  user(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<UserSummary> {
    return this.userService.getUser(id);
  }

  @ResolveField()
  profile(@Info() info: GraphQLResolveInfo): Promise<ProfileVO> {
    return this.profileService.getProfile(info.variableValues.id as string);
  }

  @ResolveField()
  async followerCount(@Info() info: GraphQLResolveInfo): Promise<number> {
    return this.followerService.getFollowerListTotal(
      info.variableValues.id as string,
    );
  }

  @ResolveField()
  followingCount(@Info() info: GraphQLResolveInfo): Promise<number> {
    return this.followerService.getFollowingListTotal(
      info.variableValues.id as string,
    );
  }

  @ResolveField()
  reviewCount(@Info() info: GraphQLResolveInfo): Promise<number> {
    return this.userService.getReviewCount(info.variableValues.id as string);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User, {
    description: '다른 유저 팔로우',
  })
  User_follow(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'id', type: () => String, description: '유저 ID (PK)' })
    id: string,
    @Args({
      name: 'follow',
      type: () => Boolean,
      description: `true: 팔로우, false: 언팔

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
    follow: boolean,
  ): Promise<User> {
    return this.userService.updateUserFollow(user, id, follow);
  }
}
