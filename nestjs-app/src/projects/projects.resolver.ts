import { Resolver, Query, Mutation, Args, ResolveField, Parent, ID } from '@nestjs/graphql';
import { ProjectType, ProjectImageType } from './dto/projects.type.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard.js';
import { UpdateProjectInput } from './dto/update-project.input.js';
import { CreateProjectImageInput } from './dto/create-project-image.input.js';
import { UpdateProjectImageInput } from './dto/update-project-image.input.js';
@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}
  @Query(() => [ProjectType], {
    name: 'projects'
  })
  async getProjects() {
    return this.projectsService.findAll();
  }
  @ResolveField(() => [ProjectImageType])
  async images(@Parent()
  project: ProjectType) {
    const dbImages = await this.projectsService.getProjectImages(project.id);
    return dbImages.map(img => ({
      id: img.id,
      url: img.url,
      order: Number(img.order ?? 0)
    }));
  }
  @Mutation(() => ProjectType, {
    name: 'createProject'
  })
  @UseGuards(AdminGuard)
  async createProject(@Args('input')
  input: CreateProjectInput) {
    return this.projectsService.create(input);
  }
  @Mutation(() => ProjectType, {
    name: 'updateProject'
  })
  @UseGuards(AdminGuard)
  async updateProject(@Args('input')
  input: UpdateProjectInput) {
    return this.projectsService.update(input);
  }
  @Mutation(() => Boolean, {
    name: 'deleteProject'
  })
  @UseGuards(AdminGuard)
  async deleteProject(@Args('id', {
    type: () => ID
  }, ParseUUIDPipe)
  id: string) {
    await this.projectsService.remove(id);
    return true;
  }
  @Mutation(() => ProjectImageType, {
    name: 'addProjectImage'
  })
  @UseGuards(AdminGuard)
  async addProjectImage(@Args('input')
  input: CreateProjectImageInput) {
    return this.projectsService.addImage(input);
  }
  @Mutation(() => ProjectImageType, {
    name: 'updateProjectImage'
  })
  @UseGuards(AdminGuard)
  async updateProjectImage(@Args('input')
  input: UpdateProjectImageInput) {
    return this.projectsService.updateImage(input);
  }
  @Mutation(() => Boolean, {
    name: 'deleteProjectImage'
  })
  @UseGuards(AdminGuard)
  async deleteProjectImage(@Args('id', {
    type: () => ID
  }, ParseUUIDPipe)
  id: string) {
    await this.projectsService.removeImage(id);
    return true;
  }
  @Mutation(() => Boolean, {
    name: 'reorderProjectImages'
  })
  @UseGuards(AdminGuard)
  async reorderProjectImages(@Args('ids', {
    type: () => [ID]
  })
  ids: string[]) {
    return this.projectsService.reorderImages(ids);
  }
}