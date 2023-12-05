import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async changeSignInStatus(email: string, isLogged: boolean) {
    const [username] = email.split('@');
    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ isLogged })
      .where('email like :email', { email: `${username}%` })
      .execute();
    return { email, isLogged };
  }
}
