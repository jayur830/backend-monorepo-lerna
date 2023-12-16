import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from '@toy/firebase';

import { CompanyLogo } from '@/entities/company_logo.entity';
import { ResumeHistory } from '@/entities/resume_history.entity';
import { ResumeHistoryDetail } from '@/entities/resume_history_detail.entity';
import { ResumeInfo } from '@/entities/resume_info.entity';
import { User } from '@/entities/user.entity';

import { ResumeResolver } from './resume.resolver';
import { ResumeService } from './resume.service';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeInfo, ResumeHistory, ResumeHistoryDetail, CompanyLogo, User])],
  providers: [ResumeResolver, ResumeService, FirebaseService],
  exports: [ResumeResolver, ResumeService],
})
export class ResumeModule {}
