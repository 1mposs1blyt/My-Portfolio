import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProfileLinkType } from '../profile/dto/profile.type.js';
import { LinksService } from './links.service.js';
import { CreateLinkInput } from './dto/create-link.input.js';
import { UpdateLinkInput } from './dto/update-link.input.js';
import { AdminGuard } from '../admin/admin.guard.js';

@Resolver(() => ProfileLinkType)
export class LinksResolver {
  constructor(private readonly linksService: LinksService) {}

  @Query(() => [ProfileLinkType], { name: 'links' })
  async getLinks() {
    return this.linksService.findAll();
  }

  @Mutation(() => ProfileLinkType, { name: 'createLink' })
  @UseGuards(AdminGuard)
  async createLink(@Args('input') input: CreateLinkInput) {
    return this.linksService.create(input);
  }

  @Mutation(() => ProfileLinkType, { name: 'updateLink' })
  @UseGuards(AdminGuard)
  async updateLink(@Args('input') input: UpdateLinkInput) {
    return this.linksService.update(input);
  }

  @Mutation(() => Boolean, { name: 'deleteLink' })
  @UseGuards(AdminGuard)
  async deleteLink(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    await this.linksService.remove(id);
    return true;
  }
}