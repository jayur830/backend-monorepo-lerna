import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyLogo } from '@/entities/company-logo.entity';
import { ResumeCompany } from '@/entities/resume-company.entity';
import { ResumeInfo } from '@/entities/resume-info.entity';
import { ResumeProject } from '@/entities/resume-project.entity';
import { ResumeProjectTech } from '@/entities/resume-project-tech.entity';
import { Tech } from '@/entities/tech.entity';
import { CompanyModule } from '@/modules/company/company.module';
import { ProjectModule } from '@/modules/project/project.module';
import { ResumeModule } from '@/modules/resume/resume.module';
import { TechModule } from '@/modules/tech/tech.module';
import { DateScalar } from '@/scalars/date/date.scalar';
import { MonthScalar } from '@/scalars/date/month.scalar';
import { YearScalar } from '@/scalars/date/year.scalar';

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
      entities: [CompanyLogo, ResumeInfo, ResumeCompany, ResumeProject, ResumeProjectTech, Tech],
      synchronize: false,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/api/graphql',
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      playground: true,
    }),
    ResumeModule,
    CompanyModule,
    ProjectModule,
    TechModule,
  ],
  providers: [YearScalar, MonthScalar, DateScalar],
})
export class AppModule {}
