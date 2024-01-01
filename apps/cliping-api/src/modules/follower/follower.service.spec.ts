import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { Follower } from '@/entities/follower.entity';

import { FollowerService } from './follower.service';

const mock = Array(faker.number.int({ max: 100 }))
  .fill(1)
  .map(() => ({
    id: faker.string.alphanumeric({ length: 28 }),
    nickName: faker.person.firstName(),
    profileImageUrl: faker.image.url(),
  }));

describe('FollowerService', () => {
  let service: FollowerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        FollowerService,
        {
          provide: DataSource,
          useValue: {
            query: jest.fn(
              (
                query: string,
                parameters: (string | number | boolean | null)[],
              ) => Promise.resolve(mock),
            ),
          },
        },
        {
          provide: getRepositoryToken(Follower),
          useValue: {
            countBy: jest.fn((where: Partial<Follower>) => {
              if (where.fromUserId) {
                return Promise.resolve(
                  mock.filter((item) => item.id === where.fromUserId).length,
                );
              }
              if (where.toUserId) {
                return Promise.resolve(
                  mock.filter((item) => item.id === where.toUserId).length,
                );
              }
              return Promise.resolve(mock.length);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<FollowerService>(FollowerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getFollowingListTotal', () => {
    const index = faker.number.int({ max: mock.length - 1 });
    expect(service.getFollowingListTotal(mock[index].id)).resolves.toBe(
      mock.filter((item) => item.id === mock[index].id).length,
    );
  });
});
