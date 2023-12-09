import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';
import { GraphQLError } from 'graphql';

import { AuthGuardType } from '../enums';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const [, , request] = context.getArgs();
      if (!request.req.headers.authorization) {
        throw new Error(AuthGuardType.Unauthorization);
      }
      const auth = this.firebaseService.getAuth();
      const idToken = request.req.headers.authorization.replace('Bearer ', '');
      const claims = await auth.verifyIdToken(idToken);
      request['user'] = claims;
      return !!claims;
    } catch (error) {
      this.logger.error(error);
      if (error.message === AuthGuardType.Unauthorization) {
        throw new GraphQLError('토큰이 필요합니다.', {
          extensions: { code: AuthGuardType.Unauthorization },
        });
      } else if (error.message.includes('Decoding Firebase ID token failed.')) {
        throw new GraphQLError('토큰이 올바른 형식이 아닙니다.', {
          extensions: { code: AuthGuardType.InvalidToken },
        });
      } else {
        throw new GraphQLError('토큰이 만료되었습니다.', {
          extensions: { code: AuthGuardType.AuthorizationExpired },
        });
      }
    }
  }
}
