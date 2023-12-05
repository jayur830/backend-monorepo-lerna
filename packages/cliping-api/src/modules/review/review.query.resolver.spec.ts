import { Test, TestingModule } from '@nestjs/testing';

import { ReviewQueryResolver } from './review.query.resolver';

describe('ReviewResolver', () => {
  let resolver: ReviewQueryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewQueryResolver],
    }).compile();

    resolver = module.get<ReviewQueryResolver>(ReviewQueryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
