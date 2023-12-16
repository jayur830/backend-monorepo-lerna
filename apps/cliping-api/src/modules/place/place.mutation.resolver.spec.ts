import { Test, TestingModule } from '@nestjs/testing';

import { PlaceMutationResolver } from './place.mutation.resolver';

describe('PlaceResolver', () => {
  let resolver: PlaceMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceMutationResolver],
    }).compile();

    resolver = module.get<PlaceMutationResolver>(PlaceMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
