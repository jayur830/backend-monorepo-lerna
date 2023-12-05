import { Test, TestingModule } from '@nestjs/testing';

import { ReviewMutationResolver } from './review.mutation.resolver';

describe('ReviewResolver', () => {
  let resolver: ReviewMutationResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewMutationResolver],
    }).compile();

    resolver = module.get<ReviewMutationResolver>(ReviewMutationResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
