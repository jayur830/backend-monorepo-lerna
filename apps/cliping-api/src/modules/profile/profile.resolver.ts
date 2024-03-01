import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';

import { ProfileService } from './profile.service';
import { UpdateProfileInput, UpdateProfilePayload } from './vo/profile.vo';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateProfilePayload, {
    description: '프로필 상세 정보 수정',
  })
  Profile_update(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'input', type: () => UpdateProfileInput })
    input: UpdateProfileInput,
  ): Promise<UpdateProfilePayload> {
    return this.profileService.updateProfile(user, input);
  }
}
