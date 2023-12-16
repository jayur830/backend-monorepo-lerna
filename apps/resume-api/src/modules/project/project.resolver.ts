import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { AuthGuard } from '@toy/guard';

import { ProjectService } from './project.service';
import { CreateProjectInput, CreateProjectPayload, DeleteProjectPayload, UpdateProjectInput, UpdateProjectPayload } from './vo/project.vo';

@Resolver()
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateProjectPayload, { description: '이력서 프로젝트 이력 추가' })
  Project_create(@Args({ name: 'input', type: () => CreateProjectInput }) input: CreateProjectInput): Promise<CreateProjectPayload> {
    return this.projectService.createProject(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateProjectPayload, { description: '이력서 프로젝트 이력 수정' })
  Project_update(@Args({ name: 'input', type: () => UpdateProjectInput }) input: UpdateProjectInput): Promise<UpdateProjectPayload> {
    return this.projectService.updateProject(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => DeleteProjectPayload, { description: '이력서 프로젝트 이력 삭제' })
  Project_delete(@Args({ name: 'projectId', type: () => Int }) projectId: number): Promise<DeleteProjectPayload> {
    return this.projectService.deleteProject(projectId);
  }
}
