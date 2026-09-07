import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';
import { UpdateProjectInput } from './dto/update-project.input.js';
import { Prisma, Language } from '../generated/prisma/client.js';
import { CreateProjectImageInput } from './dto/create-project-image.input.js';
import { UpdateProjectImageInput } from './dto/update-project-image.input.js';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}
  private map(project: any) {
    const t = project.projectTranslations[0];
    return {
      id: project.id,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      stack: project.stack,
      order: project.order,
      name: t?.name ?? '',
      description: t?.description ?? '',
      images: project.images,
    };
  }
  async findAllWithLang(lang: Language) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    return this.findByProfileId(profile.id, lang);
  }
  async findOneWithLang(id: string, lang: Language) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        projectTranslations: { where: { language: lang } },
        images: { orderBy: { order: 'asc' } },
      },
    });
    if (!project) throw new NotFoundException('Проект не найден');
    return this.map(project);
  }
  async findByProfileId(profileId: string, lang: Language) {
    const projects = await this.prisma.project.findMany({
      where: { profileId },
      orderBy: { order: 'asc' },
      include: {
        projectTranslations: {
          where: { language: lang },
        },
        images: { orderBy: { order: 'asc' } },
      },
    });

    return projects.map((project) => {
      const translation = project.projectTranslations[0];
      return {
        id: project.id,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        stack: project.stack,
        order: project.order,
        name: translation?.name || '',
        description: translation?.description || '',
        images: project.images,
      };
    });
  }

  async update(input: UpdateProjectInput) {
    const { id, name, description, language, ...data } = input as any;
    const lang = language ?? Language.RU;

    await this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        ...(name !== undefined || description !== undefined
          ? {
              projectTranslations: {
                upsert: {
                  where: {
                    projectId_language: { projectId: id, language: lang },
                  },
                  create: {
                    language: lang,
                    name: name ?? '',
                    description: description ?? '',
                  },
                  update: {
                    ...(name !== undefined && { name }),
                    ...(description !== undefined && { description }),
                  },
                },
              },
            }
          : {}),
      },
    });
    return this.findOneWithLang(id, lang);
  }

  async create(input: CreateProjectInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    const { name, description, language, ...data } = input;
    const lang = language ?? Language.RU;

    const project = await this.prisma.project.create({
      data: {
        ...data,
        profileId: profile.id,
        projectTranslations: { create: { language: lang, name, description } },
      },
    });
    return this.findOneWithLang(project.id, lang);
  }

  async getProjectImages(projectId: string) {
    return this.prisma.projectImage.findMany({
      where: {
        projectId,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({
        where: {
          id,
        },
      });
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
      where: {
        id: projectId,
      },
    });
    if (!project) throw new NotFoundException('Проект не найден');
    const nextOrder =
      order ??
      ((
        await this.prisma.projectImage.aggregate({
          where: {
            projectId,
          },
          _max: {
            order: true,
          },
        })
      )._max.order ?? -1) + 1;
    return this.prisma.projectImage.create({
      data: {
        ...rest,
        projectId,
        order: nextOrder,
      },
    });
  }

  async updateImage(input: UpdateProjectImageInput) {
    const { id, ...data } = input;
    const image = await this.prisma.projectImage.findUnique({
      where: {
        id,
      },
    });
    if (!image) throw new NotFoundException('Изображение не найдено');
    return this.prisma.projectImage.update({
      where: {
        id,
      },
      data,
    });
  }

  async removeImage(id: string) {
    const image = await this.prisma.projectImage.findUnique({
      where: {
        id,
      },
    });
    if (!image) throw new NotFoundException('Изображение не найдено');
    await this.prisma.projectImage.delete({
      where: {
        id,
      },
    });
    if (image.url.startsWith('/public/uploads/')) {
      await unlink(join(process.cwd(), image.url)).catch(() => {});
    }
  }

  async reorderImages(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.projectImage.update({
          where: {
            id,
          },
          data: {
            order: index,
          },
        }),
      ),
    );
    return true;
  }
}
