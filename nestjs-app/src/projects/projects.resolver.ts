import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { ProjectType, ProjectImageType } from './dto/projects.type.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AdminGuard } from '../admin/admin.guard.js';
import { UpdateProjectInput } from './dto/update-project.input.js';

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  // Базовый тестовый запрос, чтобы GraphQL не ругался на пустой резолвер
  @Query(() => [ProjectType], { name: 'projects' })
  async getProjects() {
    return this.projectsService.findAll();
  }
  @ResolveField(() => [ProjectImageType])
  async images(@Parent() project: ProjectType) {
    const dbImages = await this.projectsService.getProjectImages(project.id);
    return dbImages.map((img) => ({
      id: img.id,
      url: img.url,
      order: Number(img.order ?? 0),
    }));
  }
  @Mutation(() => ProjectType, { name: 'createProject' })
  @UseGuards(AdminGuard)
  async createProject(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input);
  }
  @Mutation(() => ProjectType, { name: 'updateProject' })
  @UseGuards(AdminGuard)
  async updateProject(@Args('input') input: UpdateProjectInput) {
    return this.projectsService.update(input);
  }
  @Mutation(() => Boolean, { name: 'deleteProject' })
  @UseGuards(AdminGuard)
  async deleteProject(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ) {
    await this.projectsService.remove(id);
    return true;
  }
}
