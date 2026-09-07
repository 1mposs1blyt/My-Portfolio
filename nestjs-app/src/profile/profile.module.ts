import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service.js';
import { ProfileResolver } from './profile.resolver.js';
import { ProjectsModule } from '../projects/projects.module.js'; 
import { ExperienceModule } from '../experience/experience.module.js'; 

@Module({
  imports: [ProjectsModule, ExperienceModule],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
