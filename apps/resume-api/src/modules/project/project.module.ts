import { Module } from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';

import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';

@Module({
  providers: [ProjectResolver, ProjectService, FirebaseService],
  exports: [ProjectService],
})
export class ProjectModule {}
