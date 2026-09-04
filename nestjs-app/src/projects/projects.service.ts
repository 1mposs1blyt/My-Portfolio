import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { CreateProjectInput } from './dto/create-project.input.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
  }
  async create(input:CreateProjectInput){
    return this.prisma.project.create({
      data:{
        name:input.name,
        description: input.description,
        repoUrl:input.repoUrl,
        liveUrl:input.liveUrl,
        stack:input.stack,
        order:input.order,
        profile:{
          connect:{
            id:(await this.prisma.profile.findFirst())?.id
          }
        }
      }
    })
  }
  async getProjectImages(projectId: string) {
  return this.prisma.projectImage.findMany({
    where: { projectId },
   // orderBy: { order: 'asc' }, // Чтобы в слайдере они шли по порядку
  });
}
}
