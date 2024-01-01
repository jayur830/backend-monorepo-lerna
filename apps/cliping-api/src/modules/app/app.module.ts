import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pick } from 'lodash';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

import { Follower } from '@/entities/follower.entity';
import { PlaceLike } from '@/entities/place-like.entity';
import { PlaceRating } from '@/entities/place-rating.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';
import { FollowerModule } from '@/modules/follower/follower.module';
import { PlaceModule } from '@/modules/place/place.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { ReviewModule } from '@/modules/review/review.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        const config = {
          type: 'mysql' as MysqlConnectionOptions['type'],
          host: process.env.MYSQL_HOST,
          port: +process.env.MYSQL_PORT,
          username: process.env.MYSQL_USERNAME,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          entities: [
            Profile,
            Follower,
            Review,
            ReviewLike,
            PlaceLike,
            PlaceRating,
          ],
          synchronize: false,
          logging: true,
        };
        console.log(
          JSON.stringify(
            pick(config, 'type', 'host', 'port', 'database'),
            null,
            2,
          ),
        );

        return config;
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: '/api/graphql',
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      fieldResolverEnhancers: ['interceptors'],
      playground: true,
    }),
    PlaceModule,
    ReviewModule,
    UserModule,
    ProfileModule,
    FollowerModule,
  ],
})
export class AppModule {}
