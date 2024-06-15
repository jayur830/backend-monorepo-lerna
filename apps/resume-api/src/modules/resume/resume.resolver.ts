import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';
import { AuthGuardType } from '@toy/guard/enums';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import { ResumeService } from './resume.service';
import { Company } from './vo/company.vo';
import { CreateResumeInput, CreateResumePayload, Resume, ResumeInfo, UpdateResumeInput, UpdateResumePayload } from './vo/resume.vo';

@Resolver(() => Resume)
export class ResumeResolver {
  private readonly logger = new Logger(ResumeResolver.name);

  constructor(private readonly resumeService: ResumeService) {}

  @Query(() => Resume, { description: '이력서' })
  resume(@Args({ name: 'userId', type: () => String, description: '유저 ID' }) userId: string): Promise<ResumeInfo> {
    return this.resumeService.getResumeInfo(userId);
  }

  @ResolveField()
  async companyList(@Info() info: GraphQLResolveInfo): Promise<Company[]> {
    return await this.resumeService.getCompanyList(info.variableValues.userId as string);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CreateResumePayload, { description: '이력서 요약 정보 추가' })
  Resume_create(@GqlUserContext() user: FirebaseUser, @Args({ name: 'input', type: () => CreateResumeInput }) input: CreateResumeInput): Promise<CreateResumePayload> {
    return this.resumeService.createResume(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateResumePayload, { description: '이력서 요약 정보 수정' })
  Resume_update(@GqlUserContext() user: FirebaseUser, @Args({ name: 'input', type: () => UpdateResumeInput }) input: UpdateResumeInput): Promise<UpdateResumePayload> {
    return this.resumeService.updateResume(user, input);
  }
}
