import { Module } from '@nestjs/common';
import { FirebaseModule, FirebaseService } from '@toy/firebase';

import { ClaimsController } from './claims.controller';
import { ClaimsService } from './claims.service';

@Module({
  imports: [FirebaseModule],
  controllers: [ClaimsController],
  providers: [ClaimsService, FirebaseService],
})
export class ClaimsModule {}
