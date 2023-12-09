import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { AuthGuard } from '@toy/guard';

import { PlaceService } from './place.service';

@Resolver()
export class PlaceMutationResolver {
  constructor(private readonly placeService: PlaceService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Int, { description: '장소 좋아요 누르기' })
  Place_like(
    @UserContext() user: FirebaseUser,
    @Args({ name: 'placeId', type: () => String }) placeId: string,
  ): Promise<number> {
    return this.placeService.updatePlaceLike(user, placeId);
  }
}
