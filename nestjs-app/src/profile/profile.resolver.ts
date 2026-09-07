import { Resolver, Query, Args, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { ProfileService } from './profile.service.js';
import { ProfileType, ExperienceType } from './dto/profile.type.js';
import { ProjectsService } from '../projects/projects.service.js';
import { ProjectType } from '../projects/dto/projects.type.js';
import { ExperienceService } from '../experience/experience.service.js';
import { Language } from '../generated/prisma/client.js';
import { UpdateProfileInput } from './dto/update-profile.input.js';

@Resolver(() => ProfileType)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectsService: ProjectsService,
    private readonly experienceService: ExperienceService,
  ) {}

  @Query(() => ProfileType, { name: 'profile' })
  async getProfile(
    @Args('lang', { type: () => Language, defaultValue: Language.RU }) lang: Language,
  ) {
    return this.profileService.findOneWithLang(lang);
  }

  @ResolveField(() => [ProjectType], { name: 'projects' })
  async getProjects(
    @Parent() profile: ProfileType,
    @Args('lang', { type: () => Language, defaultValue: Language.RU }) lang: Language,
  ) {
    return (this.projectsService as any).findByProfileId(profile.id, lang);
  }

  @ResolveField(() => [ExperienceType], { name: 'experience' })
  async getExperience(
    @Parent() profile: ProfileType,
    @Args('lang', { type: () => Language, defaultValue: Language.RU }) lang: Language,
  ) {
    return (this.experienceService as any).findByProfileId(profile.id, lang);
  }

  @Mutation(() => ProfileType, { name: 'updateProfile' })
  async updateProfile(@Args('input') input: UpdateProfileInput) {
    return this.profileService.update(input);
  }
}
