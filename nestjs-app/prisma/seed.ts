import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  LinkKind,
  PrismaClient,
  SkillCategory,
} from '../src/generated/prisma/client.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PROFILE_ID = '00000000-0000-0000-0000-000000000001';

async function main() {
  await prisma.$transaction(async (tx) => {
    // очистка старых записей
    await tx.achievement.deleteMany();
    await tx.profileLink.deleteMany();
    await tx.skill.deleteMany();
    await tx.experience.deleteMany();
    await tx.project.deleteMany();
    await tx.profile.deleteMany();

    // создание профиля
    await tx.profile.create({
      data: {
        id: PROFILE_ID,
        name: 'Александр Брягиня',
        headline: 'Full-stack software developer',
        description:
          'Разработка бэкенд и кроссплатформенных приложений (NestJS, PostgreSQL, Prisma, GraphQL)',
        email: 'alexander@example.com',
        location: 'Новосибирск, Россия',
        links: {
          create: [
            {
              kind: LinkKind.GITHUB,
              label: 'GitHub',
              url: 'https://github.com/1mposs1blyt',
              order: 1,
            },
            {
              kind: LinkKind.TELEGRAM,
              label: 'Telegram',
              url: 'https://t.me/alexandr_st54_nsk',
              order: 2,
            },
          ],
        },
        skills: {
          create: [
            {
              name: 'TypeScript',
              category: SkillCategory.LANGUAGE,
              level: 5,
              order: 1,
            },
            {
              name: 'NestJS',
              category: SkillCategory.BACKEND,
              level: 5,
              order: 2,
            },
            {
              name: 'Prisma',
              category: SkillCategory.DATABASE,
              level: 5,
              order: 3,
            },
            {
              name: 'GraphQL',
              category: SkillCategory.BACKEND,
              level: 4,
              order: 4,
            },
            {
              name: 'Docker',
              category: SkillCategory.INFRA,
              level: 4,
              order: 5,
            },
          ],
        },
        experience: {
          create: [
            {
              company: 'SoftTrade / Freelance',
              position: 'Full-Stack Developer',
              description: 'Разработка веб и мобильных сервисов',
              startDate: new Date('2024-01-01'),
              achievements: {
                create: [
                  {
                    text: 'Разработал сервисы учета и интеграции с фискальными регистраторами',
                    order: 1,
                  },
                  {
                    text: 'Спроектировал GraphQL API для цифровых систем управления',
                    order: 2,
                  },
                ],
              },
            },
          ],
        },
        projects: {
          create: [
            {
              name: 'SaveurBooking',
              description: 'Сервис бронирования ресторанов',
              repoUrl: 'https://github.com/1mposs1blyt/saveur-booking-task',
              stack: ['Next.js', 'React Hook Form', 'Zod', 'Prisma'],
              order: 1,
            },
            {
              name: 'Moto-voice-chat',
              description:
                'Приложение для мотоциклов (на данный момент в разработке)',
              repoUrl: 'https://github.com/1mposs1blyt/moto-voice-chat',
              stack: ['React Native', 'Express', 'WebSocket'],
              order: 2,
            },
          ],
        },
      },
    });
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
