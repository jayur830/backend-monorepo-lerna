import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';

import { UserService } from './user.service';
import { UpdateProfileInput } from './vo/update-profile-input.vo';
import { UpdateProfilePayload } from './vo/update-profile-payload.vo';
import { User } from './vo/user.vo';

@Resolver()
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateProfilePayload, {
    description: '프로필 상세 정보 수정',
  })
  Profile_update(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => UpdateProfileInput })
    input: UpdateProfileInput,
  ): Promise<UpdateProfilePayload> {
    return this.userService.updateProfile(user, input);
  }
}
