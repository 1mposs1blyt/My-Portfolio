import { Test, TestingModule } from '@nestjs/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { ProfileResolver } from './profile.resolver.js';
import { PrismaService } from '../common/prisma/prisma.service.js';
import { ProfileService } from './profile.service.js';
describe('ProfileResolver', () => {
  let resolver: ProfileResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfileResolver, {
        provide: ProfileService,
        useValue: {
          update: vi.fn(),
          findOne: vi.fn()
        }
      }, {
        provide: PrismaService,
        useValue: {
          profile: {
            findFirst: vi.fn().mockResolvedValue({
              id: '1',
              name: 'Alexander'
            })
          }
        }
      }]
    }).compile();
    resolver = module.get<ProfileResolver>(ProfileResolver);
  });
  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});