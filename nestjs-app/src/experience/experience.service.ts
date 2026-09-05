import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateExperienceInput } from './dto/create-experience.input.js';
import { UpdateExperienceInput } from './dto/update-experience.input.js';
const withAchievements = {
  achievements: {
    orderBy: {
      order: 'asc' as const
    }
  }
};
@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: {
        startDate: 'desc'
      },
      include: withAchievements
    });
  }
  async findOne(id: string) {
    const item = await this.prisma.experience.findUnique({
      where: {
        id
      },
      include: withAchievements
    });
    if (!item) throw new NotFoundException(`Experience with ID:${id} not found`);
    return item;
  }
  async create(input: CreateExperienceInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    const {
      achievements,
      ...data
    } = input;
    return this.prisma.experience.create({
      data: {
        ...data,
        profileId: profile.id,
        achievements: {
          create: (achievements ?? []).map((text, order) => ({
            text,
            order
          }))
        }
      },
      include: withAchievements
    });
  }
  async update(input: UpdateExperienceInput) {
    const {
      id,
      achievements,
      ...data
    } = input;
    await this.findOne(id);
    return this.prisma.experience.update({
      where: {
        id
      },
      data: {
        ...data,
        ...(achievements && {
          achievements: {
            deleteMany: {},
            create: achievements.map((text, order) => ({
              text,
              order
            }))
          }
        })
      },
      include: withAchievements
    });
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.experience.delete({
      where: {
        id
      }
    });
  }
}