import { Resolver, Query } from '@nestjs/graphql';
import { ProfileType } from './dto/profile.type.js';
import { PrismaService } from '../common/prisma/prisma.service.js';

@Resolver(() => ProfileType)
export class ProfileResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => ProfileType, { name: 'profile', nullable: true })
  async getProfile() {
    return this.prisma.profile.findFirst({
      include: {
        links: { orderBy: { order: 'asc' } },
        skills: { orderBy: { order: 'asc' } },
        experience: {
          orderBy: { startDate: 'desc' },
          include: { achievements: { orderBy: { order: 'asc' } } }
        },
        projects: { orderBy: { order: 'asc' } },
      },
    });
  }
}
