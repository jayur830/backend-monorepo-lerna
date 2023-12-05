import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaceLike } from '@/entities/place-like.entity';

import { PlaceMutationResolver } from './place.mutation.resolver';
import { PlaceQueryResolver } from './place.query.resolver';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceLike])],
  providers: [PlaceQueryResolver, PlaceMutationResolver, PlaceService],
})
export class PlaceModule {}
