import { NestFactory } from '@nestjs/core';

import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT;
  const env = process.env.NODE_ENV;
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(port);
  console.log('Environment:', env);
  console.log(`Server is listening port ${port}.`);
}
bootstrap();
