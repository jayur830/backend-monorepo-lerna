import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { UserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { AuthGuard } from '@toy/guard';

import { ClaimsService } from './claims.service';
import { CustomClaims } from './types/custom-claims.interface';

@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @UseGuards(AuthGuard)
  @Post()
  get(@UserContext() user: FirebaseUser): Promise<CustomClaims> {
    return this.claimsService.getCustomClaims(user);
  }

  @UseGuards(AuthGuard)
  @Put('/update')
  async update(
    @UserContext() user: FirebaseUser,
    @Body() claims: any,
  ): Promise<boolean> {
    return this.claimsService.updateCustomClaims(user, claims);
  }
}
