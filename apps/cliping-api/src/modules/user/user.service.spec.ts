import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FirebaseService } from '@toy/firebase';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';

import { Follower } from '@/entities/follower.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { FollowerService } from '@/modules/follower/follower.service';
import { ProfileService } from '@/modules/profile/profile.service';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UserService,
        FirebaseService,
        ProfileService,
        FollowerService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: jest.fn(Promise.resolve),
              startTransaction: jest.fn(Promise.resolve),
              commitTransaction: jest.fn(Promise.resolve),
              rollbackTransaction: jest.fn(Promise.resolve),
              release: jest.fn(Promise.resolve),
              manager: {
                exists: (
                  target: EntityTarget<Follower>,
                  options: FindManyOptions<Follower>,
                ) => true,
                save: jest.fn(
                  (target: EntityTarget<Follower>, entities: Follower[]) => {},
                ),
                delete: jest.fn(
                  (target: EntityTarget<Follower>, criteria: Follower) => {},
                ),
              },
            })),
          },
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Follower),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Review),
          useValue: {
            countBy: jest.fn((where: FindOptionsWhere<Review>) => 10),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
