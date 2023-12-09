import { InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FirebaseService } from '@toy/firebase';
import { AuthGuard, ProdGuard } from '@toy/guard';

import { UserPayload } from '@/vo/user.payload';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseGuards(ProdGuard)
  @Mutation(() => Boolean, { description: 'Set admin user (in local only)' })
  async Admin_update(@Args({ name: 'uid', type: () => String, description: 'Firebase user uid' }) uid: string) {
    try {
      const auth = this.firebaseService.getAuth();
      await auth.setCustomUserClaims(uid, {
        'gh-page': {
          admin: true,
        },
      });
      return true;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserPayload, { description: '로그인' })
  async signIn(@Args({ name: 'email', type: () => String, description: '이메일' }) email: string) {
    return await this.authService.changeSignInStatus(email, true);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UserPayload, { description: '로그아웃' })
  async signOut(@Args({ name: 'email', type: () => String, description: '이메일' }) email: string) {
    return await this.authService.changeSignInStatus(email, false);
  }
}
