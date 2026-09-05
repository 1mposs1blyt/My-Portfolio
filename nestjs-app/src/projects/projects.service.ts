import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';
import { UpdateProjectInput } from './dto/update-project.input.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
  }
  async update(input: UpdateProjectInput) {
    const { id, ...data } = input;
    return this.prisma.project.update({ where: { id }, data });
  }
  async create(input: CreateProjectInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');

    return this.prisma.project.create({
      data: { ...input, profileId: profile.id },
    });
  }
  async getProjectImages(projectId: string) {
    return this.prisma.projectImage.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
    });
  }
  async remove(id: string) {
    try {
      await this.prisma.project.delete({ where: { id } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Проект не найден');
      }
      throw e;
    }
  }
}
