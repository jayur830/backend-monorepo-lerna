import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';
import { AuthGuardType } from '@toy/guard/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const [request] = context.getArgs();
      if (!request.headers.authorization) {
        throw new Error(AuthGuardType.Unauthorization);
      }
      const auth = this.firebaseService.getAuth();
      const idToken = request.headers.authorization.replace('Bearer ', '');
      const claims = await auth.verifyIdToken(idToken);
      request['user'] = claims;
      return !!claims;
    } catch (error) {
      this.logger.error(error);
      if (error.message === AuthGuardType.Unauthorization) {
        throw new ForbiddenException(
          '토큰이 필요합니다.',
          AuthGuardType.Unauthorization,
        );
      } else if (error.message.includes('Decoding Firebase ID token failed.')) {
        throw new ForbiddenException(
          '토큰이 올바른 형식이 아닙니다.',
          AuthGuardType.InvalidToken,
        );
      } else {
        throw new ForbiddenException(
          '토큰이 만료되었습니다.',
          AuthGuardType.AuthorizationExpired,
        );
      }
    }
  }
}
