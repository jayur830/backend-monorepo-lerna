import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import firebase from 'firebase-admin';
import { GraphQLError } from 'graphql';

import { AuthGuardType } from '@/enum/auth.enum';
import { FirebaseService } from '@/modules/firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly auth: firebase.auth.Auth;

  constructor(private readonly firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const [, , request] = context.getArgs();
      if (!request.req.headers.authorization) {
        throw new Error(AuthGuardType.Unauthorization);
      }
      const claims = await this.auth.verifyIdToken(request.req.headers.authorization.replace('Bearer ', ''));
      if (!claims.admin) {
        throw new Error(AuthGuardType.NotAdministrator);
      }
      return true;
    } catch (error) {
      this.logger.error(error);
      if (error.message === AuthGuardType.Unauthorization) {
        throw new GraphQLError('토큰이 필요합니다.', {
          extensions: { code: AuthGuardType.Unauthorization },
        });
      } else if (error.message.startsWith('Decoding Firebase ID token failed.')) {
        throw new GraphQLError('토큰이 올바른 형식이 아닙니다.', {
          extensions: { code: AuthGuardType.InvalidToken },
        });
      } else if (error.message === AuthGuardType.NotAdministrator) {
        throw new GraphQLError('관리자가 아닙니다.', {
          extensions: { code: AuthGuardType.NotAdministrator },
        });
      } else {
        throw new GraphQLError('토큰이 만료되었습니다.', {
          extensions: { code: AuthGuardType.AuthorizationExpired },
        });
      }
    }
  }
}
