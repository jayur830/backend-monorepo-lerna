import { Logger, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { UserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { AuthGuard } from '@toy/guard';

import { CompanyService } from './company.service';
import { CreateCompanyInput, CreateCompanyPayload, DeleteCompanyPayload, UpdateCompanyInput, UpdateCompanyPayload } from './vo/company.vo';

@Resolver()
export class CompanyResolver {
  private readonly logger = new Logger(CompanyResolver.name);

  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateCompanyPayload, { description: '이력서 회사 정보 추가' })
  Company_create(@UserContext() user: FirebaseUser, @Args({ name: 'input', type: () => CreateCompanyInput }) input: CreateCompanyInput): Promise<CreateCompanyPayload> {
    return this.companyService.createCompany(user.uid, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateCompanyPayload, { description: '이력서 회사 정보 수정' })
  Company_update(@UserContext() user: FirebaseUser, @Args({ name: 'input', type: () => UpdateCompanyInput }) input: UpdateCompanyInput): Promise<UpdateCompanyPayload> {
    return this.companyService.updateCompany(user.uid, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => DeleteCompanyPayload, { description: '이력서 회사 정보 삭제' })
  Company_delete(@Args({ name: 'companyId', type: () => Int }) companyId: number) {
    return this.companyService.deleteCompany(companyId);
  }
}
