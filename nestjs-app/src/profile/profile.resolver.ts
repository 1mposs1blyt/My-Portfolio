import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProfileType } from './dto/profile.type.js';
import { UpdateProfileInput } from './dto/update-profile.input.js';
import { ProfileService } from './profile.service.js';
import { AdminGuard } from '../admin/admin.guard.js';
import { PrismaService } from '../common/prisma/prisma.service.js';

@Resolver(() => ProfileType)
export class ProfileResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  @Query(() => ProfileType, { name: 'profile', nullable: true })
  async getProfile() {
    return this.prisma.profile.findFirst({
      include: {
        links: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        experience: {
          orderBy: { startDate: 'desc' },
          include: { achievements: { orderBy: { order: 'asc' } } },
        },
        projects: { orderBy: { order: 'asc' } },
      },
    });
  }

  @Mutation(() => ProfileType, { name: 'updateProfile' })
  @UseGuards(AdminGuard)
  async updateProfile(@Args('input') input: UpdateProfileInput) {
    return this.profileService.update(input);
  }
}