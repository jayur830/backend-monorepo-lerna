import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { PlaceService } from './place.service';

@Resolver()
export class PlaceQueryResolver {
  constructor(private readonly placeService: PlaceService) {}

  @Query(() => Int, { description: '장소에 대한 좋아요 수' })
  placeLikeCount(
    @Args({ name: 'placeId', type: () => String, description: '장소 ID' })
    placeId: string,
  ): Promise<number> {
    return this.placeService.placeLikeCount(placeId);
  }
}
