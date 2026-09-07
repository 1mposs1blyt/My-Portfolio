import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { SkillType } from './dto/skills.type.js';
import { SkillsService } from './skills.service.js';
import { CreateSkillInput } from './dto/create-skill.input.js';
import { UpdateSkillInput } from './dto/update-skill.input.js';
import { AdminGuard } from '../admin/admin.guard.js';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator.js';
@Resolver(() => SkillType)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}
  @Query(() => [SkillType], {
    name: 'skills',
  })
  async getSkills() {
    return this.skillsService.findAll();
  }
  @Query(() => SkillType, {
    name: 'skill',
    nullable: true,
  })
  async getSkill(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ) {
    return this.skillsService.findOne(id);
  }
  @Mutation(() => SkillType, {
    name: 'createSkill',
  })
  async createSkill(
    @Args('input')
    input: CreateSkillInput,
  ) {
    return this.skillsService.create(input);
  }
  @Mutation(() => SkillType, {
    name: 'updateSkill',
  })
  @UseGuards(AdminGuard)
  async updateSkill(
    @Args('input')
    input: UpdateSkillInput,
  ) {
    return this.skillsService.update(input);
  }
  @Mutation(() => SkillType, {
    name: 'deleteSkill',
  })
  async deleteSkill(
    @Args('id', {
      type: () => ID,
    })
    id: string,
  ) {
    return this.skillsService.remove(id);
  }
}
