import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT;
  const env = process.env.NODE_ENV;
  await app.listen(port);
  console.log(
    `\n${JSON.stringify(
      {
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      },
      null,
      2,
    )}\n`,
  );
  console.log('Environment:', env);
  console.log(`Server is listening port ${port}.`);
}
bootstrap();
