import { Test, TestingModule } from '@nestjs/testing';
import { TechResolver } from './tech.resolver';

describe('TechResolver', () => {
  let resolver: TechResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechResolver],
    }).compile();

    resolver = module.get<TechResolver>(TechResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
