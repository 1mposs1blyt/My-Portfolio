import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { SkillType } from './dto/skills.type.js';
import { SkillsService } from './skills.service.js';
import { CreateSkillInput } from './dto/create-skill.input.js';
import { UpdateSkillInput } from './dto/update-skill.input.js';

@Resolver(() => SkillType)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  // READ ALL
  @Query(() => [SkillType], { name: 'skills' })
  async getSkills() {
    return this.skillsService.findAll();
  }
  // READ ONE
  @Query(() => SkillType, { name: 'skill', nullable: true })
  async getSkill(@Args('id', { type: () => ID }) id: string) {
    return this.skillsService.findOne(id);
  }
  // CREATE
  @Mutation(() => SkillType, { name: 'createSkill' })
  async createSkill(@Args('input') input: CreateSkillInput) {
    return this.skillsService.create(input);
  }
  // UPDATE
  @Mutation(() => SkillType, { name: 'updateSkill' })
  async updateSkill(@Args('input') input: UpdateSkillInput) {
    return this.skillsService.update(input.id, input);
  }
  // DELETE
  @Mutation(() => SkillType, { name: 'deleteSkill' })
  async deleteSkill(@Args('id', { type: () => ID }) id: string) {
    return this.skillsService.remove(id);
  }
}
