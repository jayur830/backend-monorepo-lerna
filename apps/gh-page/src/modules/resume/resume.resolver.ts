import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@toy/guard';

import { AdminGuard } from '@/guards/admin.guard';
import { CreateCompanyInput } from '@/vo/create-company.input';
import { CreateCompanyPayload } from '@/vo/create-company.payload';
import { CreateHistoryDetailInput } from '@/vo/create-history-detail.input';
import { Resume } from '@/vo/resume.vo';
import { UpdateCompanyInput } from '@/vo/update-company.input';
import { UpdateCompanyPayload } from '@/vo/update-company.payload';
import { UpdateHistoryDetailInput as UpdateHistoryDetailInput } from '@/vo/update-history-detail.input';
import { UpdateHistoryDetailPayload as UpdateHistoryDetailPayload } from '@/vo/update-history-detail.payload';
import { UpdateInfoInput } from '@/vo/update-info.input';
import { UpdateInfoPayload } from '@/vo/update-info.payload';

import { ResumeService } from './resume.service';

@Resolver()
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @Query(() => Resume, { description: '이력서' })
  async Resume_get() {
    return this.resumeService.findOne();
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => UpdateInfoPayload, { description: '이력서 제목, Github 주소 수정' })
  async Resume_updateInfo(@Args({ name: 'input', type: () => UpdateInfoInput }) input: UpdateInfoInput) {
    return this.resumeService.updateInfo(input);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => CreateCompanyPayload, { description: '이력서 내 회사 정보 추가' })
  async Resume_createCompanyInfo(@Args({ name: 'input', type: () => CreateCompanyInput }) input: CreateCompanyInput) {
    return this.resumeService.createCompanyInfo(input);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => UpdateCompanyPayload, { description: '이력서 내 회사 정보 수정' })
  async Resume_updateCompanyInfo(@Args({ name: 'input', type: () => UpdateCompanyInput }) input: UpdateCompanyInput) {
    return this.resumeService.updateCompanyInfo(input);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => String, { description: '이력서 내 회사 정보 삭제' })
  async Resume_deleteCompanyInfo(@Args({ name: 'companyId', type: () => String }) companyId: string) {
    return this.resumeService.deleteCompanyInfo(companyId);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => UpdateHistoryDetailPayload, { description: '이력서 내 경력 상세 정보 추가' })
  async Resume_createHistoryDetail(@Args({ name: 'input', type: () => CreateHistoryDetailInput }) input: CreateHistoryDetailInput) {
    return this.resumeService.createHistoryDetail(input);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => UpdateHistoryDetailPayload, { description: '이력서 내 경력 상세 정보 수정' })
  async Resume_updateHistoryDetail(@Args({ name: 'input', type: () => UpdateHistoryDetailInput }) input: UpdateHistoryDetailInput) {
    return this.resumeService.updateHistoryDetail(input);
  }

  @UseGuards(AuthGuard)
  @UseGuards(AdminGuard)
  @Mutation(() => String, { description: '이력서 내 경력 상세 정보 삭제' })
  async Resume_deleteHistoryDetail(@Args({ name: 'historyDetailId', type: () => String }) historyDetailId: string) {
    return this.resumeService.deleteHistoryDetail(historyDetailId);
  }
}
