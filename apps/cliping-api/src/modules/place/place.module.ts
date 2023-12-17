import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaceLike } from '@/entities/place-like.entity';

import { PlaceResolver } from './place.resolver';
import { PlaceService } from './place.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceLike])],
  providers: [PlaceResolver, PlaceService],
})
export class PlaceModule {}
