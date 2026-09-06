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
  // Сид больше не удаляет данные: если профиль уже есть, выходим.
  // Чтобы залить заново — сначала снеси профиль руками.
  // Запуск с FORCE_SEED=1 очистит и пересоздаст всё.
  const existing = await prisma.profile.findFirst();
  
  if (existing && process.env.FORCE_SEED !== '1') {
    console.log('Профиль уже существует — сид пропущен');
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.achievement.deleteMany();
      await tx.projectImage.deleteMany();
      await tx.profileLink.deleteMany();
      await tx.skill.deleteMany();
      await tx.experience.deleteMany();
      await tx.project.deleteMany();
      await tx.profile.deleteMany();
    }

    await tx.profile.create({
      data: {
        id: PROFILE_ID,
        name: 'Александр Брягиня',
        headline: 'Full-stack software developer',
        description:
          'Делаю продукты целиком: бэкенд на NestJS с GraphQL и Prisma, интерфейсы на React, десктоп и мобильные приложения. Много работал с интеграциями — кассовые системы, сервис-деск, мессенджеры: беру чужой API и превращаю его в инструмент, которым пользуются каждый день.',
        email: 'alexandr.bryaginya@gmail.com',
        location: 'Новосибирск, Россия',

        links: {
          create: [
            {
              kind: LinkKind.GITHUB,
              label: '1mposs1blyt',
              url: 'https://github.com/1mposs1blyt',
              order: 1,
            },
            {
              kind: LinkKind.TELEGRAM,
              label: '@alexandr_st54_nsk',
              url: 'https://t.me/alexandr_st54_nsk',
              order: 2,
            },
            {
              kind: LinkKind.EMAIL,
              label: 'alexandr.bryaginya@gmail.com',
              url: 'mailto:alexandr.bryaginya@gmail.com',
              order: 3,
            },
          ],
        },

        skills: {
          create: [
            { name: 'TypeScript', category: SkillCategory.LANGUAGE, level: 5, order: 1 },
            { name: 'JavaScript', category: SkillCategory.LANGUAGE, level: 5, order: 2 },
            { name: 'SQL', category: SkillCategory.LANGUAGE, level: 4, order: 3 },

            { name: 'React', category: SkillCategory.FRONTEND, level: 5, order: 1 },
            { name: 'React Native', category: SkillCategory.FRONTEND, level: 4, order: 2 },
            { name: 'Next.js', category: SkillCategory.FRONTEND, level: 4, order: 3 },

            { name: 'Node.js', category: SkillCategory.BACKEND, level: 5, order: 1 },
            { name: 'NestJS', category: SkillCategory.BACKEND, level: 5, order: 2 },
            { name: 'Express', category: SkillCategory.BACKEND, level: 4, order: 3 },
            { name: 'GraphQL', category: SkillCategory.BACKEND, level: 4, order: 4 },

            { name: 'PostgreSQL', category: SkillCategory.DATABASE, level: 4, order: 1 },
            { name: 'Prisma', category: SkillCategory.DATABASE, level: 5, order: 2 },
            { name: 'SQLite', category: SkillCategory.DATABASE, level: 4, order: 3 },

            { name: 'Docker', category: SkillCategory.INFRA, level: 4, order: 1 },
            { name: 'nginx', category: SkillCategory.INFRA, level: 3, order: 2 },

            { name: 'Git', category: SkillCategory.TOOL, level: 5, order: 1 },
            { name: 'Electron', category: SkillCategory.TOOL, level: 4, order: 2 },
            { name: 'Tauri', category: SkillCategory.TOOL, level: 3, order: 3 },
          ],
        },

        experience: {
          create: [
            {
              company: 'SoftTrade / Freelance',
              position: 'Full-Stack Developer',
              description: 'Разработка веб- и мобильных сервисов, интеграции со сторонними API.',
              startDate: new Date('2024-01-01'),
              achievements: {
                create: [
                  {
                    text: 'Разработал сервисы учёта и интеграции с фискальными регистраторами',
                    order: 1,
                  },
                  {
                    text: 'Спроектировал GraphQL API для цифровых систем управления',
                    order: 2,
                  },
                  {
                    text: 'Связал сервис-деск Okdesk с мессенджерами: заявки создаются и отслеживаются из чата',
                    order: 3,
                  },
                ],
              },
            },
          ],
        },

        projects: {
          create: [
            {
              name: 'Это портфолио',
              description:
                'Сайт вместе с админкой. Контент лежит в PostgreSQL, отдаётся через GraphQL, редактируется через /admin — она открыта всем в демо-режиме: формы, валидация и загрузка работают, но правки живут только в вашей вкладке. Запись в базу открывает токен в заголовке, проверка на бэкенде через timing-safe сравнение хешей. Отзывы собираются по одноразовым ссылкам с ограниченным сроком жизни. Всё поднимается одной командой в Docker: Postgres, NestJS и nginx.',
              repoUrl: 'https://github.com/1mposs1blyt',
              stack: [
                'TypeScript',
                'React',
                'Vite',
                'urql',
                'NestJS',
                'GraphQL',
                'Prisma',
                'PostgreSQL',
                'Docker',
                'nginx',
              ],
              order: 1,
            },
            {
              name: 'SaveurBooking',
              description:
                'Тестовое задание для Saveur Studio: бронирование столика с валидацией на клиенте. Правила вынесены в схемы Zod, форма на неконтролируемых полях React Hook Form — ввод без задержек и лишних ререндеров. Временные слоты генерируются от текущего момента: прошедшие часы сегодняшнего дня недоступны, горизонт брони ограничен 90 днями. Маска телефона форматирует номер прямо при вводе.',
              repoUrl: 'https://github.com/1mposs1blyt/saveur-booking-task',
              liveUrl:
                'https://saveur-booking-task-g2m7u3rj6-1mposs1blyts-projects.vercel.app/',
              stack: [
                'Next.js',
                'React',
                'TypeScript',
                'React Hook Form',
                'Zod',
                'Tailwind',
                'Framer Motion',
              ],
              order: 2,
            },
            {
              name: 'Moto-voice-chat',
              description:
                'Голосовая рация для байкеров в поездках без мобильной связи: телефоны соединяются через Wi-Fi-хотспот, интернет и сервер не нужны. Устройства находят друг друга сами через Zeroconf, аудио идёт по WebRTC с шумо- и эхоподавлением, сигналинг — напрямую по UDP между телефонами. Требует нативной сборки: задействованы модули микрофона и сети. В разработке.',
              repoUrl: 'https://github.com/1mposs1blyt/moto-voice-chat',
              stack: ['React Native', 'Expo', 'WebRTC', 'Zeroconf', 'UDP', 'NativeWind'],
              order: 3,
            },
            {
              name: 'Telegram Bot Manager',
              description:
                'Десктопное приложение для управления ботами на удалённых серверах: запуск, остановка, статус и поток входящих сообщений в реальном времени. Подключение к серверам по SSH, команды и логи идут через сокет, конфигурация ботов хранится локально в SQLite. Собирается под Windows, Linux и macOS, ставится как обычное приложение или запускается портативно из папки.',
              stack: ['Electron', 'Node.js', 'Socket.IO', 'SQLite'],
              order: 4,
            },
            {
              name: 'Бот заявок Telegram/Max → Okdesk',
              description:
                'Заявки в сервис-деск создаются прямо из телеграма, без перехода в интерфейс Okdesk. Бот переносит текст и вложения, а автора определяет по username и сам подставляет его в нужные поля Okdesk API — заявка приходит уже привязанной к конкретному клиенту. Позже переписан под мессенджер MAX: бизнес-логика вынесена из транспортного слоя, так что смена платформы затронула только адаптер отправки.',
              stack: ['Node.js', 'Telegram Bot API', 'Okdesk API'],
              order: 5,
            },
            {
              name: 'Уведомления Okdesk → Telegram',
              description:
                'Заявки без ответственного не теряются: бот принимает вебхук от Okdesk, фильтрует события по статусу и присылает в рабочий чат карточку с заголовком, описанием и ссылками на исходное сообщение и автора. Обратная сторона к боту создания заявок — вместе они замыкают цикл.',
              stack: ['Node.js', 'Express', 'Okdesk Webhooks', 'Telegram Bot API'],
              order: 6,
            },
            {
              name: 'mbox → xlsx с классификацией писем',
              description:
                'Разбирает архив почты из Thunderbird в таблицу с готовыми категориями. Конвейер из трёх шагов: парсинг mbox в JSON, определение категории письма через LLM по теме и тексту, сборка xlsx. Промежуточные результаты сохраняются в файлы, поэтому дорогой шаг классификации не повторяется при перезапуске. Собран в самостоятельный .exe с интерактивным меню и настройкой через .env — заказчику не нужен установленный Node.',
              stack: ['Node.js', 'TypeScript', 'Inquirer', 'xlsx', 'mbox-parser'],
              order: 7,
            },
            {
              name: 'Мост 1С → iikoChain',
              description:
                'Убрал ручной перенос номенклатуры между 1С и iikoChain. Парсинг xlsx на сервере, маппинг полей в формат iiko API, пакетная отправка актов приготовления с обработкой частичных отказов.',
              stack: ['Node.js', 'Express', 'jQuery', 'xlsx'],
              order: 8,
            },
            {
              name: 'Эйн&Штейн — платформа устного счёта',
              description:
                'Веб-платформа для школы ментальной арифметики: тренажёры устного счёта и учёт результатов учеников. Сессионная авторизация, генерация примеров по уровням сложности, серверный рендеринг на Express.',
              stack: ['Node.js', 'Express', 'Bootstrap 5'],
              order: 9,
            },
            {
              name: 'EinsteinBot — бот подбора программ обучения',
              description:
                'Телеграм-бот для языковой школы: проводит диалог с родителем, собирает контакты и формат занятий, подбирает подходящую программу. Заявка уходит менеджеру. Сейчас не развёрнут.',
              stack: ['Node.js', 'Telegram Bot API'],
              order: 10,
            },
            {
              name: 'Конвертер характеристик товаров в HTML',
              description:
                'Заменил PHP-скрипт при переезде сайта на другой движок: разбирает выгрузку xlsx, где характеристики товара лежат одной строкой с разделителями, и собирает из них готовую HTML-таблицу в отдельной колонке. Обработка идёт пакетно по всему файлу, результат сразу пригоден для импорта в новую CMS.',
              stack: ['Node.js', 'xlsx'],
              order: 11,
            },
            {
              name: 'Одностраничный сайт для студента',
              description:
                'Одностраничный сайт с каталогом объектов и хранением данных в SQLite. Сделан как учебный проект: помимо кода — разбор реализации, чтобы заказчик мог поддерживать сайт сам.',
              stack: ['Node.js', 'Express', 'SQLite'],
              order: 12,
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