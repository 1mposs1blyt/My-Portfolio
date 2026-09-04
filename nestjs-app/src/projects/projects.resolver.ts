import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProjectType, ProjectImageType } from './dto/projects.type.js';
import { ProjectsService } from './projects.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';

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
    // return this.projectsService.getProjectImages(project.id);
    const dbImages = await this.projectsService.getProjectImages(project.id);
    return dbImages.map((img) => ({
      id: img.id,
      url: img.url,
      order: Number(img.order ?? 0),
    }));
  }
  @Mutation(() => ProjectType, { name: 'createProject' })
  async createProject(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input);
  }
}
