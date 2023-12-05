import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import firebase from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: firebase.app.App;

  constructor(private readonly configService: ConfigService) {
    if (!firebase.apps.length) {
      this.firebaseApp = firebase.initializeApp({
        credential: firebase.credential.cert({
          // clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
          // projectId: configService.get('FIREBASE_PROJECT_ID'),
          // privateKey: configService
          //   .get('FIREBASE_PRIVATE_KEY')
          //   .replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      this.firebaseApp = firebase.app();
    }
  }

  getAuth() {
    return this.firebaseApp.auth();
  }

  verifyIdToken(idToken: string) {
    return this.getAuth().verifyIdToken(idToken);
  }
}
