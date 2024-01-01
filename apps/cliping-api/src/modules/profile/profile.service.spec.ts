import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DataSource, EntityTarget } from 'typeorm';

import { Profile } from '@/entities/profile.entity';

import { ProfileService } from './profile.service';

const mock = Array(faker.number.int({ max: 100 }))
  .fill(1)
  .map((_, i) => ({
    id: i + 1,
    nickName: faker.person.firstName(),
    description: faker.lorem.lines(2),
    subTitle: faker.lorem.lines(1),
    backgroundImageUrl: faker.image.url(),
    profileImageUrl: faker.image.url(),
    instagramUrl: faker.internet.url(),
    userId: faker.string.alphanumeric({ length: 28 }),
  }));

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(() => ({
              connect: () => Promise.resolve(),
              startTransaction: () => Promise.resolve(),
              commitTransaction: () => Promise.resolve(),
              rollbackTransaction: () => Promise.resolve(),
              release: () => Promise.resolve(),
              manager: {
                update: (
                  target: EntityTarget<Profile>,
                  criteria: Profile,
                  input: Partial<Profile>,
                ) => Promise.resolve(),
                findOneBy(target, criteria: Profile) {},
              },
            })),
          },
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: {
            findOneBy: jest.fn((where: { userId: string }) => {
              const [result] = mock.filter(
                (item) => item.userId === where.userId,
              );
              return Promise.resolve(result);
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
