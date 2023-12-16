import { Module } from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';

import { ProjectService } from '@/modules/project/project.service';

import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  providers: [CompanyResolver, CompanyService, ProjectService, FirebaseService],
})
export class CompanyModule {}
