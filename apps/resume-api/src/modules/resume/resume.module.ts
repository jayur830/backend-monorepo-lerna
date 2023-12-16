import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from '@toy/firebase';

import { ResumeInfo } from '@/entities/resume-info.entity';

import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeInfo])],
  providers: [ResumeResolver, ResumeService, FirebaseService],
})
export class ResumeModule {}
