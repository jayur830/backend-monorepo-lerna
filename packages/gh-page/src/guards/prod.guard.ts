import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class ProdGuard implements CanActivate {
  canActivate() {
    return process.env.NODE_ENV === 'development';
  }
}
