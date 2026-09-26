import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateExperienceInput } from './dto/create-experience.input.js';
import { UpdateExperienceInput } from './dto/update-experience.input.js';
import { Language } from '../generated/prisma/client.js';
const withAchievements = {
  achievements: {
    orderBy: {
      order: 'asc' as const,
    },
  },
};
@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly withTranslations = (lang: Language) => ({
    experienceTranslations: {
      where: {
        language: lang,
      },
    },
    achievements: {
      orderBy: {
        order: 'asc' as const,
      },
      include: {
        achievementTranslations: {
          where: {
            language: lang,
          },
        },
      },
    },
  });
  private map(exp: any) {
    const t = exp.experienceTranslations[0];
    return {
      id: exp.id,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate,
      position: t?.position ?? '',
      description: t?.description ?? null,
      achievements: exp.achievements.map((a: any) => ({
        id: a.id,
        text: a.achievementTranslations[0]?.text ?? '',
        order: a.order,
      })),
    };
  }
  async findOneWithLang(id: string, lang: Language) {
    const exp = await this.prisma.experience.findUnique({
      where: {
        id,
      },
      include: this.withTranslations(lang),
    });
    if (!exp) throw new NotFoundException(`Experience with ID:${id} not found`);
    return this.map(exp);
  }
  async findByProfileId(profileId: string, lang: Language) {
    const list = await this.prisma.experience.findMany({
      where: {
        profileId,
      },
      orderBy: {
        startDate: 'desc',
      },
      include: this.withTranslations(lang),
    });
    return list.map((e) => this.map(e));
  }
  async findAllWithLang(lang: Language) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    return this.findByProfileId(profile.id, lang);
  }
  async findOne(id: string) {
    const item = await this.prisma.experience.findUnique({
      where: {
        id,
      },
      include: withAchievements,
    });
    if (!item)
      throw new NotFoundException(`Experience with ID:${id} not found`);
    return item;
  }
  async create(input: CreateExperienceInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    const { achievements, position, description, language, ...data } = input;
    const lang = language ?? Language.RU;
    const exp = await this.prisma.experience.create({
      data: {
        ...data,
        profileId: profile.id,
        experienceTranslations: {
          create: {
            language: lang,
            position,
            description,
          },
        },
        achievements: {
          create: (achievements ?? []).map((text, order) => ({
            order,
            achievementTranslations: {
              create: {
                language: lang,
                text,
              },
            },
          })),
        },
      },
    });
    return this.findOneWithLang(exp.id, lang);
  }
  async update(input: UpdateExperienceInput) {
    const { id, achievements, position, description, language, ...data } =
      input;
    const lang = language ?? Language.RU;
    await this.findOne(id);
    await this.prisma.experience.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...((position !== undefined || description !== undefined) && {
          experienceTranslations: {
            upsert: {
              where: {
                experienceId_language: {
                  experienceId: id,
                  language: lang,
                },
              },
              create: {
                language: lang,
                position: position ?? '',
                description,
              },
              update: {
                ...(position !== undefined && {
                  position,
                }),
                ...(description !== undefined && {
                  description,
                }),
              },
            },
          },
        }),
        ...(achievements && {
          achievements: {
            deleteMany: {},
            create: achievements.map((text, order) => ({
              order,
              achievementTranslations: {
                create: {
                  language: lang,
                  text,
                },
              },
            })),
          },
        }),
      },
    });
    return this.findOneWithLang(id, lang);
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.experience.delete({
      where: {
        id,
      },
    });
  }
}
