import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { UserContext } from '@/decorators/user-context.decorator';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { FirebaseUser } from '@/modules/firebase/types/user.interface';

import { UserService } from './user.service';
import { UpdateProfileInput } from './vo/update-profile-input.vo';
import { UpdateProfilePayload } from './vo/update-profile-payload.vo';
import { User } from './vo/user.vo';

@Resolver()
export class UserMutationResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => User, {
    description: '다른 유저 팔로우',
  })
  User_follow(
    @UserContext() user: FirebaseUser,
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

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateProfilePayload, {
    description: '프로필 상세 정보 수정',
  })
  Profile_update(
    @UserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => UpdateProfileInput })
    input: UpdateProfileInput,
  ): Promise<UpdateProfilePayload> {
    return this.userService.updateProfile(user, input);
  }
}
