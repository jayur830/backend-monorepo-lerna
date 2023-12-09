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
import { FirebaseService } from '@toy/firebase';
import { CreateRequest } from 'firebase-admin/lib/auth/auth-config';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { DataSource, Repository } from 'typeorm';

import { User } from '@/entities/user.entity';
import { AuthProvider } from '@/enums/auth-provider.enum';

import { PropertyKeys } from '../kakao/enums';
import { KakaoService } from '../kakao/kakao.service';
import { NaverService } from '../naver/naver.service';
import { CustomTokenResponse } from './types/custom-token.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly kakaoService: KakaoService,
    private readonly naverService: NaverService,
  ) {}

  async signIn(authorization: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const auth = this.firebaseService.getAuth();
      const user = await auth.verifyIdToken(authorization);
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
      const response = await this.kakaoService.getMe(authorization, [
        PropertyKeys.Email,
      ]);
      const data = response.data;

      return this.authorizeCustomProvider('cliping', AuthProvider.KAKAO, {
        displayName: data.properties.nickname,
        email: data.kakao_account.email,
      });
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

    const tokenClaims = await this.naverService.authorize(
      authorization,
      process.env.NAVER_APP_CLIENT_ID,
      process.env.NAVER_APP_CLIENT_SECRET,
    );

    try {
      const data = await this.naverService.getMe(tokenClaims.access_token);

      return this.authorizeCustomProvider('cliping', AuthProvider.NAVER, {
        displayName: data.response.name,
        email: data.response.email,
      });
      return { token: '' };
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

  private async authorizeCustomProvider(
    service: string,
    customProvider: AuthProvider,
    properties: Pick<CreateRequest, 'displayName' | 'email'>,
  ) {
    const auth = this.firebaseService.getAuth();

    try {
      const user = await auth.getUserByEmail(properties.email);
      const customClaims = {
        ...user.customClaims?.[service],
        provider: [
          ...new Set<AuthProvider>([
            ...flattenDeep<AuthProvider>(
              user?.customClaims?.[service]?.provider || [],
            ),
            customProvider,
          ]),
        ].sort(),
      };
      await auth.setCustomUserClaims(user.uid, {
        ...user.customClaims,
        [service]: customClaims,
      });
      const token = await auth.createCustomToken(user.uid, customClaims);
      return { token };
    } catch {
      const uid = this.alphaNumeric(28);
      const customClaims = {
        id: uid,
        name: properties.displayName,
        email: properties.email,
        provider: [customProvider],
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };

      await auth.createUser({ uid, ...properties });
      await auth.setCustomUserClaims(uid, {
        [service]: customClaims,
      });
      const token = await auth.createCustomToken(uid, customClaims);
      return { token };
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
