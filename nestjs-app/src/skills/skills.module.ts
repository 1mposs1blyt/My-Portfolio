import { Module } from '@nestjs/common';
import { SkillsResolver } from './skills.resolver.js';
import { SkillsService } from './skills.service.js';
import { ProfileModule } from '../profile/profile.module.js';
@Module({
  imports: [ProfileModule],
  providers: [SkillsResolver, SkillsService]
})
export class SkillsModule {}