import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Follower } from '@/entities/follower.entity';
import { PlaceLike } from '@/entities/place-like.entity';
import { PlaceRating } from '@/entities/place-rating.entity';
import { Profile } from '@/entities/profile.entity';
import { Review } from '@/entities/review.entity';
import { ReviewLike } from '@/entities/review-like.entity';
import { User } from '@/entities/user.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { PlaceModule } from '@/modules/place/place.module';
import { ReviewModule } from '@/modules/review/review.module';
import { UserModule } from '@/modules/user/user.module';

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
      entities: [
        User,
        Profile,
        Follower,
        Review,
        ReviewLike,
        PlaceLike,
        PlaceRating,
      ],
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
    PlaceModule,
    ReviewModule,
    UserModule,
  ],
})
export class AppModule {}
