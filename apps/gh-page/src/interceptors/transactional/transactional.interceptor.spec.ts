import { TransactionalInterceptor } from './transactional.interceptor';

describe('TransactionalInterceptor', () => {
  it('should be defined', () => {
    expect(new TransactionalInterceptor()).toBeDefined();
  });
});
