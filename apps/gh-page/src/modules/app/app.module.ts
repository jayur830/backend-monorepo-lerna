import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AboutMe } from '@/entities/about_me.entity';
import { CompanyLogo } from '@/entities/company_logo.entity';
import { ResumeHistory } from '@/entities/resume_history.entity';
import { ResumeHistoryDetail } from '@/entities/resume_history_detail.entity';
import { ResumeInfo } from '@/entities/resume_info.entity';
import { User } from '@/entities/user.entity';
// import { TransactionalInterceptor } from '@/interceptors/transactional/transactional.interceptor';
import { AuthModule } from '@/modules/auth/auth.module';
import { ResumeModule } from '@/modules/resume/resume.module';
import { DateScalar } from '@/scalars/date/date.scalar';
import { MonthScalar } from '@/scalars/date/month.scalar';
import { YearScalar } from '@/scalars/date/year.scalar';

import { InfoModule } from '../info/info.module';
import { TechModule } from '../tech/tech.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [ResumeInfo, ResumeHistory, ResumeHistoryDetail, CompanyLogo, User, AboutMe],
      synchronize: false,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/api/graphql',
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      playground: true,
    }),
    AuthModule,
    ResumeModule,
    TechModule,
    InfoModule,
  ],
  providers: [
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TransactionalInterceptor,
    // },
    YearScalar,
    MonthScalar,
    DateScalar,
  ],
})
export class AppModule {}
