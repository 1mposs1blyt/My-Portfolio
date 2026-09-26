import { Module } from '@nestjs/common';
import { ProjectsResolver } from './projects.resolver.js';
import { ProjectsService } from './projects.service.js';
@Module({
  providers: [ProjectsResolver, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
