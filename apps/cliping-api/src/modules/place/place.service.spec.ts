import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';

import { PlaceLike } from '@/entities/place-like.entity';

import { PlaceService } from './place.service';

describe('PlaceService', () => {
  let service: PlaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaceService,
        {
          provide: getRepositoryToken(PlaceLike),
          useValue: {
            countBy: jest.fn(async (where: FindOptionsWhere<PlaceLike>) => 0),
            save: jest.fn(async (entity: PlaceLike) => []),
            delete: jest.fn(
              async (criteria: FindOptionsWhere<PlaceLike>) => {},
            ),
          },
        },
      ],
    }).compile();

    service = module.get<PlaceService>(PlaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
