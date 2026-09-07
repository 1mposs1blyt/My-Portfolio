import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateLinkInput } from './dto/create-link.input.js';
import { UpdateLinkInput } from './dto/update-link.input.js';
@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.profileLink.findMany({
      orderBy: {
        order: 'asc',
      },
    });
  }
  async findOne(id: string) {
    const link = await this.prisma.profileLink.findUnique({
      where: {
        id,
      },
    });
    if (!link) throw new NotFoundException(`Link with ID:${id} not found`);
    return link;
  }
  async create(input: CreateLinkInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    return this.prisma.profileLink.create({
      data: {
        ...input,
        profileId: profile.id,
      },
    });
  }
  async update(input: UpdateLinkInput) {
    const { id, ...data } = input;
    await this.findOne(id);
    return this.prisma.profileLink.update({
      where: {
        id,
      },
      data,
    });
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.profileLink.delete({
      where: {
        id,
      },
    });
  }
}
