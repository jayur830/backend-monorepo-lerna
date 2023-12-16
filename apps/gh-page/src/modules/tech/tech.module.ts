import { Module } from '@nestjs/common';

import { TechResolver } from './tech.resolver';

@Module({
  providers: [TechResolver],
})
export class TechModule {}
