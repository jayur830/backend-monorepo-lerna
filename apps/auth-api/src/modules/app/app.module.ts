import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClaimsModule } from '@/modules/claims/claims.module';
import { OAuthModule } from '@/modules/oauth/oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OAuthModule,
    ClaimsModule,
  ],
})
export class AppModule {}
