import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FirebaseService } from './firebase.service';

@Global()
@Module({
  providers: [FirebaseService, ConfigService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
