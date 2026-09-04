import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateSkillInput } from './dto/create-skill.input.js';
import { UpdateSkillInput } from './dto/update-skill.input.js';

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}
  // CRUD system ready!!
  // READ (get all)
  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
  }
  // READ (get one)
  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({ where: { id } });
    if (!skill) throw new NotFoundException(`Skill with ID:${id} not found`);
    return skill;
  }
  // CREATE
  async create(input: CreateSkillInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile)
      throw new NotFoundException('Profile not found! Create a new one');

    return this.prisma.skill.upsert({
      // 1. По какому уникальному ключу ищем существующую запись
      where: {
        profileId_name: {
          profileId: profile.id,
          name: input.name,
        },
      },
      // 2. Что делать, если запись НАЙДЕНА (обновляем поля)
      update: {
        category: input.category,
        level: input.level,
        order: input.order,
      },
      // 3. Что делать, если записи НЕТ (создаем новую)
      create: {
        name: input.name,
        category: input.category,
        level: input.level,
        order: input.order,
        profileId: profile.id,
      },
    });
  }

  // UPDATE
  async update(id: string, input: UpdateSkillInput) {
    await this.findOne(id);

    const { id: _, ...updateData } = input;
    return this.prisma.skill.update({
      where: { id },
      data: updateData,
    });
  }

  // DELETE
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.skill.delete({ where: { id } });
  }
}
