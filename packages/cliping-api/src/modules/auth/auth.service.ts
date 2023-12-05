import { HttpService } from '@nestjs/axios';
import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { shuffle } from 'lodash';
import { flattenDeep } from 'lodash';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { DataSource, Repository } from 'typeorm';

import { User } from '@/entities/user.entity';
import { AuthProvider } from '@/enums/auth-provider.enum';
import { FirebaseService } from '@/modules/firebase/firebase.service';

import { CustomTokenResponse } from './types/custom-token.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async signIn(authorization: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const auth = this.firebaseService.getAuth();
      const user = await this.firebaseService.verifyIdToken(authorization);
      const { customClaims } = await auth.getUserByEmail(user.email);
      const provider = [
        ...new Set<AuthProvider>([
          ...flattenDeep<AuthProvider>(customClaims?.cliping?.provider || []),
          ...flattenDeep(this.getProvider(user)),
        ]),
      ].sort();
      await auth.setCustomUserClaims(user.uid, {
        ...customClaims,
        cliping: {
          ...customClaims?.cliping,
          provider,
        },
      });

      const repository = queryRunner.manager.withRepository(
        this.userRepository,
      );
      const count = await repository.countBy({ id: user.uid });

      this.logger.debug(JSON.stringify(user, null, 2));
      if (count === 0) {
        const result = await repository.save({
          id: user.uid,
          name: user.name,
          email: user.email,
          provider: provider.join(','),
          createdAt: user.cliping?.created_at || dayjs().toDate(),
        });
        await queryRunner.commitTransaction();
        return {
          ...result,
          provider: result.provider.split(','),
        };
      } else {
        await repository
          .createQueryBuilder()
          .update()
          .set({
            provider: provider.join(','),
          })
          .where('id = :id', { id: user.uid })
          .execute();
        await queryRunner.commitTransaction();
        return {
          id: user.uid,
          name: user.name,
          email: user.email,
          provider,
          createdAt: user.cliping?.created_at || dayjs().toDate(),
        };
      }
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async authenticateKakao(
    authorization?: string,
  ): Promise<CustomTokenResponse> {
    if (!authorization) {
      throw new ForbiddenException(
        'Access denied. Please provide authorization code.',
      );
    }

    try {
      const response = await this.httpService.axiosRef.post(
        'https://kapi.kakao.com/v2/user/me',
        {
          property_keys: ['kakao_account.email'],
        },
        {
          headers: {
            Authorization: `Bearer ${authorization}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      const data = response.data;

      const auth = this.firebaseService.getAuth();

      try {
        const user = await auth.getUserByEmail(data.kakao_account.email);
        this.logger.log('Update kakao user.');
        const customClaims = {
          ...user?.customClaims?.cliping,
          provider: [
            ...new Set<AuthProvider>([
              ...flattenDeep<AuthProvider>(
                user?.customClaims?.cliping?.provider || [],
              ),
              AuthProvider.KAKAO,
            ]),
          ].sort(),
        };
        await auth.setCustomUserClaims(user.uid, {
          ...user.customClaims,
          cliping: customClaims,
        });
        const token = await auth.createCustomToken(user.uid, customClaims);
        return { token };
      } catch (error) {
        this.logger.log('Create kakao user.');
        const uid = this.alphaNumeric(28);
        const properties = {
          displayName: data.properties.nickname,
          email: data.kakao_account.email,
        };
        const customClaims = {
          id: uid,
          name: properties.displayName,
          email: properties.email,
          provider: [AuthProvider.KAKAO],
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };

        await auth.createUser({ uid, ...properties });
        await auth.setCustomUserClaims(uid, {
          cliping: customClaims,
        });
        const token = await auth.createCustomToken(uid, customClaims);
        return { token };
      }
    } catch (error) {
      switch (error.code) {
        case 'ERR_BAD_REQUEST':
          throw new UnauthorizedException(
            'Invalid token. Please provide valid authorization code.',
          );
        default:
          throw error;
      }
    }
  }

  async authenticateNaver(
    authorization?: string,
  ): Promise<CustomTokenResponse> {
    if (!authorization) {
      throw new ForbiddenException(
        'Access denied. Please provide authorization code.',
      );
    }

    // const clientId = this.configService.get('NAVER_APP_CLIENT_ID');
    // const clientSecret = this.configService.get('NAVER_APP_CLIENT_SECRET');
    const clientId = process.env.NAVER_APP_CLIENT_ID;
    const clientSecret = process.env.NAVER_APP_CLIENT_SECRET;
    const tokenClaims = await this.httpService.axiosRef
      .get(
        `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${authorization}`,
      )
      .then((response) => response.data);

    if (tokenClaims.error) {
      switch (tokenClaims.error) {
        case 'invalid_request':
          throw new UnauthorizedException(
            'Invalid token. Please provide valid authorization code.',
          );
        default:
          throw tokenClaims;
      }
    }

    try {
      const data = await this.httpService.axiosRef
        .get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `Bearer ${tokenClaims.access_token}`,
          },
        })
        .then((response) => response.data);

      const auth = this.firebaseService.getAuth();

      try {
        const user = await auth.getUserByEmail(data.response.email);
        this.logger.log('Update naver user.');
        const customClaims = {
          ...user.customClaims?.cliping,
          provider: [
            ...new Set<AuthProvider>([
              ...flattenDeep<AuthProvider>(
                user?.customClaims?.cliping?.provider || [],
              ),
              AuthProvider.NAVER,
            ]),
          ].sort(),
        };
        this.logger.debug(user?.customClaims);
        await auth.setCustomUserClaims(user.uid, {
          ...user.customClaims,
          cliping: customClaims,
        });
        const token = await auth.createCustomToken(user.uid, customClaims);
        return { token };
      } catch {
        this.logger.log('Create naver user.');
        const uid = this.alphaNumeric(28);
        const properties = {
          displayName: data.response.name,
          email: data.response.email,
        };
        const customClaims = {
          id: uid,
          name: properties.displayName,
          email: properties.email,
          provider: [AuthProvider.NAVER],
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };

        await auth.createUser({ uid, ...properties });
        await auth.setCustomUserClaims(uid, {
          cliping: customClaims,
        });
        const token = await auth.createCustomToken(uid, customClaims);
        return { token };
      }
    } catch (error) {
      switch (error.code) {
        case 'ERR_BAD_REQUEST':
          throw new UnauthorizedException(
            'Invalid token. Please provide valid access token.',
          );
        default:
          throw error;
      }
    }
  }

  private getProvider(user: DecodedIdToken): AuthProvider[] {
    console.log('sign_in_provider:', user.firebase.sign_in_provider);

    switch (user.firebase.sign_in_provider) {
      case 'google.com':
        return [AuthProvider.GOOGLE];
      case 'facebook.com':
        return [AuthProvider.FACEBOOK];
      case 'apple.com':
        return [AuthProvider.APPLE];
      case 'custom':
        return user.provider as AuthProvider[];
      default:
        return [];
    }
  }

  private alphaNumeric(length: number, alphaLength: number = 22) {
    const numericLength = length - alphaLength;
    const alphaArr = Array(alphaLength)
      .fill(1)
      .map(() =>
        String.fromCharCode(
          (Math.round(Math.random() * 10000) % 2 === 0 ? 'a' : 'A').charCodeAt(
            0,
          ) + Math.floor(Math.random() * 10),
        ),
      );
    const numericArr = Array(numericLength)
      .fill(1)
      .map(() => Math.floor(Math.random() * 10));
    return shuffle([...alphaArr, ...numericArr]).join('');
  }
}
