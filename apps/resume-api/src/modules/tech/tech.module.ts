import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Tech } from '@/entities/tech.entity';

import { TechResolver } from './tech.resolver';
import { TechService } from './tech.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tech])],
  providers: [TechResolver, TechService],
})
export class TechModule {}
