import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOptionsWhere } from 'typeorm';

import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';

import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn((query: string) => []),
          },
        },
        {
          provide: getRepositoryToken(Review),
          useValue: {
            exists: jest.fn(async (options: FindManyOptions<Review>) => true),
            save: jest.fn(async (entities: Review[]) => []),
          },
        },
        {
          provide: getRepositoryToken(ReviewLike),
          useValue: {
            countBy: jest.fn(async (where: FindOptionsWhere<ReviewLike>) => 0),
            save: jest.fn(async (entity: ReviewLike) => []),
            delete: jest.fn(
              async (criteria: FindOptionsWhere<ReviewLike>) => {},
            ),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
