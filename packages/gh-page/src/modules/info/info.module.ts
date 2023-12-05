import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ResumeHistoryDetail } from '@/entities/resume_history_detail.entity';

import { InfoResolver } from './info.resolver';
import { InfoService } from './info.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeHistoryDetail])],
  providers: [InfoResolver, InfoService],
  exports: [InfoResolver, InfoService],
})
export class InfoModule {}
