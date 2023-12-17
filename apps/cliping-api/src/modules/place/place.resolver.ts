import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';

import { PlaceService } from './place.service';

@Resolver()
export class PlaceResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Query(() => Int, { description: '장소에 대한 좋아요 수' })
  placeLikeCount(
    @Args({ name: 'placeId', type: () => String, description: '장소 ID' })
    placeId: string,
  ): Promise<number> {
    return this.placeService.placeLikeCount(placeId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Int, { description: '장소 좋아요 누르기' })
  Place_like(
    @GqlUserContext() user: FirebaseUser,
    @Args({ name: 'placeId', type: () => String }) placeId: string,
  ): Promise<number> {
    return this.placeService.updatePlaceLike(user, placeId);
  }
}
