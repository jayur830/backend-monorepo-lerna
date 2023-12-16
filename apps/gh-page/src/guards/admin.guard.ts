import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';
import { GraphQLError } from 'graphql';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [, , request] = context.getArgs();
    const auth = this.firebaseService.getAuth();
    const idToken = request.req.headers.authorization.replace('Bearer ', '');
    const claims = await auth.verifyIdToken(idToken);
    if (!claims.admin) {
      throw new GraphQLError('관리자가 아닙니다.', {
        extensions: { code: 'NOT_ADMINISTRATOR' },
      });
    }
    return true;
  }
}
