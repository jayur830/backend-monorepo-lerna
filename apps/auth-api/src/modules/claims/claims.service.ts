import { Injectable } from '@nestjs/common';
import { FirebaseService } from '@toy/firebase';
import type { FirebaseUser } from '@toy/firebase/types';

import { CustomClaims } from './types/custom-claims.interface';

@Injectable()
export class ClaimsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async getCustomClaims(user: FirebaseUser): Promise<CustomClaims> {
    const auth = this.firebaseService.getAuth();
    const firebaseUser = await auth.getUser(user.uid);
    return firebaseUser.customClaims;
  }

  async updateCustomClaims(user: FirebaseUser, claims: any): Promise<boolean> {
    const auth = this.firebaseService.getAuth();
    await auth.setCustomUserClaims(user.uid, claims);
    return true;
  }
}
