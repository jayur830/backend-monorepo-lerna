import { Test, TestingModule } from '@nestjs/testing';

import { PlaceQueryResolver } from './place.query.resolver';

describe('PlaceResolver', () => {
  let resolver: PlaceQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaceQueryResolver],
    }).compile();

    resolver = module.get<PlaceQueryResolver>(PlaceQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
