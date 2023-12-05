import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PlaceLike } from '@/entities/place-like.entity';
import { FirebaseUser } from '@/modules/firebase/types/user.interface';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(PlaceLike)
    private readonly placeLikeRepository: Repository<PlaceLike>,
  ) {}

  async placeLikeCount(placeId: string): Promise<number> {
    return await this.placeLikeRepository.countBy({ placeId });
  }

  async updatePlaceLike(user: FirebaseUser, placeId: string): Promise<number> {
    const criteria = { placeId, userId: user.uid };
    const placeLikeCount = await this.placeLikeRepository.countBy(criteria);

    if (!placeLikeCount) {
      await this.placeLikeRepository.save(criteria);
    } else {
      await this.placeLikeRepository.delete(criteria);
    }

    return await this.placeLikeRepository.count({ where: { placeId } });
  }
}
