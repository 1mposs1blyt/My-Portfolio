import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { UpdateProfileInput } from './dto/update-profile.input.js';
import { Language } from '../generated/prisma/client.js';
@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async findRawFirst() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    return profile;
  }
  async findOneWithLang(lang: Language) {
    const [profile, reviewsCount] = await Promise.all([
      this.prisma.profile.findFirst({
        include: {
          profileTranslations: {
            where: {
              language: lang,
            },
          },
          links: {
            orderBy: {
              order: 'asc',
            },
          },
          skills: {
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              projects: true,
            },
          },
        },
      }),
      this.prisma.review.count(),
    ]);
    if (!profile) throw new NotFoundException('Профиль не найден');
    const translation = profile.profileTranslations[0];
    return {
      id: profile.id,
      email: profile.email,
      name: translation?.name || '',
      headline: translation?.headline || '',
      description: translation?.description || '',
      location: translation?.location || null,
      links: profile.links,
      skills: profile.skills,
      counts: {
        projects: profile._count.projects,
        reviews: reviewsCount,
      },
      experience: [],
      projects: [],
    };
  }
  async update(input: UpdateProfileInput) {
    const profile = await this.findRawFirst();
    const { name, headline, description, location, email, language } = input;
    const targetLang = language ?? Language.RU;
    const hasTranslationFields =
      name !== undefined ||
      headline !== undefined ||
      description !== undefined ||
      location !== undefined;
    const [updatedProfile, reviewsCount] = await Promise.all([
      this.prisma.profile.update({
        where: {
          id: profile.id,
        },
        data: {
          ...(email && {
            email,
          }),
          ...(hasTranslationFields
            ? {
                profileTranslations: {
                  upsert: {
                    where: {
                      profileId_language: {
                        profileId: profile.id,
                        language: targetLang,
                      },
                    },
                    create: {
                      language: targetLang,
                      name: name || '',
                      headline: headline || '',
                      description: description || '',
                      location: location || null,
                    },
                    update: {
                      ...(name !== undefined && {
                        name,
                      }),
                      ...(headline !== undefined && {
                        headline,
                      }),
                      ...(description !== undefined && {
                        description,
                      }),
                      ...(location !== undefined && {
                        location,
                      }),
                    },
                  },
                },
              }
            : {}),
        },
        include: {
          profileTranslations: {
            where: {
              language: targetLang,
            },
          },
          links: {
            orderBy: {
              order: 'asc',
            },
          },
          skills: {
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              projects: true,
            },
          },
        },
      }),
      this.prisma.review.count(),
    ]);
    const translation = updatedProfile.profileTranslations[0];
    return {
      id: updatedProfile.id,
      email: updatedProfile.email,
      name: translation?.name || '',
      headline: translation?.headline || '',
      description: translation?.description || '',
      location: translation?.location || null,
      links: updatedProfile.links,
      skills: updatedProfile.skills,
      counts: {
        projects: updatedProfile._count.projects,
        reviews: reviewsCount,
      },
      experience: [],
      projects: [],
    };
  }
}
