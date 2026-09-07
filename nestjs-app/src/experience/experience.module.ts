import { Module } from '@nestjs/common';
import { ExperienceResolver } from './experience.resolver.js';
import { ExperienceService } from './experience.service.js';
@Module({
  providers: [ExperienceResolver, ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}