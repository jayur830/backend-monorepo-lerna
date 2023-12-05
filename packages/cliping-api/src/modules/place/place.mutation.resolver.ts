import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';

import { UserContext } from '@/decorators/user-context.decorator';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { FirebaseUser } from '@/modules/firebase/types/user.interface';

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
