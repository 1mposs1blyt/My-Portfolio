import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { UpdateProfileInput } from './dto/update-profile.input.js';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne() {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Профиль не найден');
    return profile;
  }

  async update(input: UpdateProfileInput) {
    const profile = await this.findOne();
    return this.prisma.profile.update({ where: { id: profile.id }, data: input });
  }
}