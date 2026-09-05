import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';
import { UpdateProjectInput } from './dto/update-project.input.js';
import { Prisma } from '../generated/prisma/client.js';
import { CreateProjectImageInput } from './dto/create-project-image.input.js';
import { UpdateProjectImageInput } from './dto/update-project-image.input.js';
import { unlink } from 'fs/promises';
import { join } from 'path';
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
  async addImage(input: CreateProjectImageInput) {
    const { projectId, order, ...rest } = input;

    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new NotFoundException('Проект не найден');

    // если порядок не задан — ставим картинку в конец
    const nextOrder =
      order ??
      ((
        await this.prisma.projectImage.aggregate({
          where: { projectId },
          _max: { order: true },
        })
      )._max.order ?? -1) + 1;

    return this.prisma.projectImage.create({
      data: { ...rest, projectId, order: nextOrder },
    });
  }
  async updateImage(input: UpdateProjectImageInput) {
    const { id, ...data } = input;
    const image = await this.prisma.projectImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Изображение не найдено');

    return this.prisma.projectImage.update({ where: { id }, data });
  }
  async removeImage(id: string) {
    const image = await this.prisma.projectImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Изображение не найдено');

    await this.prisma.projectImage.delete({ where: { id } });

    // внешние ссылки не трогаем, только свои файлы
    if (image.url.startsWith('/public/uploads/')) {
      await unlink(join(process.cwd(), image.url)).catch(() => {});
    }
  }
  async reorderImages(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.projectImage.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );
    return true;
  }
}
