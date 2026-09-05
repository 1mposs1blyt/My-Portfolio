import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ExperienceType } from '../profile/dto/profile.type.js';
import { ExperienceService } from './experience.service.js';
import { CreateExperienceInput } from './dto/create-experience.input.js';
import { UpdateExperienceInput } from './dto/update-experience.input.js';
import { AdminGuard } from '../admin/admin.guard.js';
@Resolver(() => ExperienceType)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}
  @Query(() => [ExperienceType], {
    name: 'experience'
  })
  async getExperience() {
    return this.experienceService.findAll();
  }
  @Mutation(() => ExperienceType, {
    name: 'createExperience'
  })
  @UseGuards(AdminGuard)
  async createExperience(@Args('input')
  input: CreateExperienceInput) {
    return this.experienceService.create(input);
  }
  @Mutation(() => ExperienceType, {
    name: 'updateExperience'
  })
  @UseGuards(AdminGuard)
  async updateExperience(@Args('input')
  input: UpdateExperienceInput) {
    return this.experienceService.update(input);
  }
  @Mutation(() => Boolean, {
    name: 'deleteExperience'
  })
  @UseGuards(AdminGuard)
  async deleteExperience(@Args('id', {
    type: () => ID
  }, ParseUUIDPipe)
  id: string) {
    await this.experienceService.remove(id);
    return true;
  }
}