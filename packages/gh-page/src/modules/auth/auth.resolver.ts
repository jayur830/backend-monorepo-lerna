import { InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import firebase from 'firebase-admin';

import { AuthGuard } from '@/guards/auth.guard';
import { ProdGuard } from '@/guards/prod.guard';
import { FirebaseService } from '@/modules/firebase/firebase.service';
import { UserPayload } from '@/vo/user.payload';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);
  private readonly auth: firebase.auth.Auth;

  constructor(
    private authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {
    this.auth = firebaseService.getAuth();
  }

  @UseGuards(ProdGuard)
  @Mutation(() => Boolean, { description: 'Set admin user (in local only)' })
  async Admin_update(@Args({ name: 'uid', type: () => String, description: 'Firebase user uid' }) uid: string) {
    try {
      await this.auth.setCustomUserClaims(uid, { admin: true });
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
