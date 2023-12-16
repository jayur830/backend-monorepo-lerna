import { Logger, UseGuards } from '@nestjs/common';
import { Args, Info, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GqlUserContext } from '@toy/decorator';
import type { FirebaseUser } from '@toy/firebase/types';
import { GqlAuthGuard } from '@toy/guard';
import { GraphQLResolveInfo } from 'graphql';

import { ResumeService } from './resume.service';
import { Company } from './vo/company.vo';
import { CreateResumeInfoInput, CreateResumeInfoPayload, DeleteResumeInfoPayload, Resume, ResumeInfo, UpdateResumeInfoInput, UpdateResumeInfoPayload } from './vo/resume.vo';

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
  @Mutation(() => CreateResumeInfoPayload, { description: '이력서 요약 정보 추가' })
  Resume_create(@GqlUserContext() user: FirebaseUser, @Args({ name: 'input', type: () => CreateResumeInfoInput }) input: CreateResumeInfoInput): Promise<CreateResumeInfoPayload> {
    return this.resumeService.createResume(user, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UpdateResumeInfoPayload, { description: '이력서 요약 정보 수정' })
  Resume_update(@GqlUserContext() user: FirebaseUser, @Args({ name: 'input', type: () => UpdateResumeInfoInput }) input: UpdateResumeInfoInput): Promise<UpdateResumeInfoPayload> {
    return this.resumeService.updateResume(user, input);
  }
}
