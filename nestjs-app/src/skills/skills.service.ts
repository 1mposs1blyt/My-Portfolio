import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateSkillInput } from './dto/create-skill.input.js';
import { UpdateSkillInput } from './dto/update-skill.input.js';
@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: {
        order: 'asc'
      }
    });
  }
  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: {
        id
      }
    });
    if (!skill) throw new NotFoundException(`Skill with ID:${id} not found`);
    return skill;
  }
  async create(input: CreateSkillInput) {
    const profile = await this.prisma.profile.findFirst();
    if (!profile) throw new NotFoundException('Profile not found! Create a new one');
    const exists = await this.prisma.skill.findUnique({
      where: {
        profileId_name: {
          profileId: profile.id,
          name: input.name
        }
      }
    });
    if (exists) throw new ConflictException(`Навык «${input.name}» уже есть`);
    return this.prisma.skill.create({
      data: {
        ...input,
        profileId: profile.id
      }
    });
  }
  async update(input: UpdateSkillInput) {
    const {
      id,
      ...data
    } = input;
    await this.findOne(id);
    return this.prisma.skill.update({
      where: {
        id
      },
      data
    });
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.skill.delete({
      where: {
        id
      }
    });
  }
}