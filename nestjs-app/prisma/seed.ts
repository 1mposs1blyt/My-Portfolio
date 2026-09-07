import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Language, LinkKind, SkillCategory, ReviewType } from '../src/generated/prisma/client.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PROFILE_ID = '00000000-0000-0000-0000-000000000001';

async function wipe() {
  // порядок важен: сначала то, что ни от чего не каскадится
  await prisma.reviewTranslation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.reviewToken.deleteMany();
  await prisma.achievementTranslation.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.experienceTranslation.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.projectImage.deleteMany();
  await prisma.projectTranslation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profileTranslation.deleteMany();
  await prisma.profileLink.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();
  console.log('— всё снесено');
}

async function seed() {
  const profile = await prisma.profile.create({
    data: {
      id: PROFILE_ID,
      email: 'alexander@example.ru',
      profileTranslations: {
        create: [
          {
            language: Language.RU,
            name: 'Александр Брягиня',
            headline: 'Full-stack разработчик',
            description:
              'Пишу на TypeScript уже несколько лет: Node.js и NestJS на бэкенде, React и React Native на фронте. Люблю задачи, где надо разобраться в чужой предметной области и собрать из неё работающий продукт.',
            location: 'Хельсинки, удалённо',
          },
          {
            language: Language.EN,
            name: 'Alexander Bryaginya',
            headline: 'Full-stack developer',
            description:
              'TypeScript developer with several years of experience: Node.js and NestJS on the backend, React and React Native on the frontend. I enjoy projects where you have to dig into an unfamiliar domain and turn it into a working product.',
            location: 'Helsinki, remote',
          },
        ],
      },
      links: {
        create: [
          { kind: LinkKind.GITHUB, label: 'GitHub', url: 'https://github.com/1mposs1blyt', order: 0 },
          { kind: LinkKind.TELEGRAM, label: 'Telegram', url: 'https://t.me/username', order: 1 },
          { kind: LinkKind.EMAIL, label: 'alexander@example.ru', url: 'mailto:alexander@example.ru', order: 2 },
          { kind: LinkKind.WEBSITE, label: 'Портфолио', url: 'https://1mposs1blyt.duckdns.org', order: 3 },
        ],
      },
      skills: {
        create: [
          { name: 'TypeScript', category: SkillCategory.LANGUAGE, level: 5, order: 0 },
          { name: 'JavaScript', category: SkillCategory.LANGUAGE, level: 5, order: 1 },
          { name: 'SQL', category: SkillCategory.LANGUAGE, level: 4, order: 2 },
          { name: 'React', category: SkillCategory.FRONTEND, level: 5, order: 0 },
          { name: 'React Native', category: SkillCategory.FRONTEND, level: 4, order: 1 },
          { name: 'Next.js', category: SkillCategory.FRONTEND, level: 4, order: 2 },
          { name: 'Node.js', category: SkillCategory.BACKEND, level: 5, order: 0 },
          { name: 'NestJS', category: SkillCategory.BACKEND, level: 5, order: 1 },
          { name: 'GraphQL', category: SkillCategory.BACKEND, level: 4, order: 2 },
          { name: 'PostgreSQL', category: SkillCategory.DATABASE, level: 4, order: 0 },
          { name: 'Prisma', category: SkillCategory.DATABASE, level: 5, order: 1 },
          { name: 'Redis', category: SkillCategory.DATABASE, level: 3, order: 2 },
          { name: 'Docker', category: SkillCategory.INFRA, level: 4, order: 0 },
          { name: 'nginx', category: SkillCategory.INFRA, level: 3, order: 1 },
          { name: 'Git', category: SkillCategory.TOOL, level: 5, order: 0 },
          { name: 'Vite', category: SkillCategory.TOOL, level: 4, order: 1 },
        ],
      },
    },
  });
  console.log('— профиль, ссылки, навыки');

  // ---------- ОПЫТ ----------

  const experiences = [
    {
      company: 'SoftTrade',
      startDate: new Date('2024-08-01'),
      endDate: null,
      ru: {
        position: 'Инженер-программист',
        description: 'Разработка внутренних сервисов компании на NestJS и React.',
        achievements: [
          'Перевёл REST API на GraphQL, время ответа на составных запросах упало вдвое',
          'Настроил CI с прогоном тестов и автодеплоем в staging',
          'Собрал систему локализации контента на уровне БД',
        ],
      },
      en: {
        position: 'Software Engineer',
        description: 'Building internal company services with NestJS and React.',
        achievements: [
          'Migrated the REST API to GraphQL, halving response time on composite queries',
          'Set up CI with automated tests and staging deployment',
          'Built a database-level content localization system',
        ],
      },
    },
    {
      company: 'Фриланс',
      startDate: new Date('2022-03-01'),
      endDate: new Date('2024-07-31'),
      ru: {
        position: 'Full-stack разработчик',
        description: 'Заказные проекты для малого бизнеса: от лендингов до кассовых систем.',
        achievements: [
          'Сделал кассовое приложение для сети кофеен на React Native',
          'Автоматизировал выгрузку отчётности, сэкономив заказчику день работы в неделю',
        ],
      },
      en: {
        position: 'Full-stack Developer',
        description: 'Freelance projects for small businesses, from landing pages to POS systems.',
        achievements: [
          'Built a React Native POS app for a coffee shop chain',
          'Automated reporting exports, saving the client a day of work per week',
        ],
      },
    },
    {
      company: 'ITL Group',
      startDate: new Date('2021-06-01'),
      endDate: new Date('2022-02-28'),
      ru: {
        position: 'Junior-разработчик',
        description: 'Поддержка и доработка веб-приложений на Node.js.',
        achievements: [
          'Закрыл технический долг по миграциям, ускорив выкатки',
          'Написал первые интеграционные тесты в проекте',
        ],
      },
      en: {
        position: 'Junior Developer',
        description: 'Maintaining and extending Node.js web applications.',
        achievements: [
          'Cleared migration tech debt, speeding up releases',
          "Wrote the project's first integration tests",
        ],
      },
    },
  ];

  for (const exp of experiences) {
    const created = await prisma.experience.create({
      data: {
        profileId: profile.id,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        experienceTranslations: {
          create: [
            { language: Language.RU, position: exp.ru.position, description: exp.ru.description },
            { language: Language.EN, position: exp.en.position, description: exp.en.description },
          ],
        },
      },
    });

    for (let i = 0; i < exp.ru.achievements.length; i++) {
      await prisma.achievement.create({
        data: {
          experienceId: created.id,
          order: i,
          achievementTranslations: {
            create: [
              { language: Language.RU, text: exp.ru.achievements[i] },
              { language: Language.EN, text: exp.en.achievements[i] },
            ],
          },
        },
      });
    }
  }
  console.log('— опыт и достижения');

  // ---------- ПРОЕКТЫ ----------

  const projects = [
    {
      order: 0,
      repoUrl: 'https://github.com/1mposs1blyt/portfolio',
      liveUrl: 'https://1mposs1blyt.duckdns.org',
      stack: ['NestJS', 'GraphQL', 'Prisma', 'React', 'PostgreSQL'],
      images: ['/public/uploads/portfolio-1.png', '/public/uploads/portfolio-2.png'],
      ru: {
        name: 'Портфолио',
        description:
          'Сайт-визитка с админкой и полной локализацией RU/EN на уровне базы. Бэкенд на NestJS с GraphQL, фронт на React, интерфейс стилизован под редактор кода.',
      },
      en: {
        name: 'Portfolio',
        description:
          'A personal site with an admin panel and full RU/EN localization at the database level. NestJS with GraphQL on the backend, React on the frontend, styled after a code editor.',
      },
    },
    {
      order: 1,
      repoUrl: 'https://github.com/1mposs1blyt/pos-system',
      liveUrl: null,
      stack: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL'],
      images: ['/public/uploads/pos-1.png'],
      ru: {
        name: 'Кассовая система',
        description:
          'Аналог iiko Front для небольших заведений: заказы, столы, печать чеков, работа офлайн с последующей синхронизацией. Продаётся по подписке с тарифными уровнями.',
      },
      en: {
        name: 'POS System',
        description:
          'An iiko Front alternative for small venues: orders, tables, receipt printing, offline mode with later sync. Sold as a subscription with tiered plans.',
      },
    },
    {
      order: 2,
      repoUrl: 'https://github.com/1mposs1blyt/pos-analytics',
      liveUrl: null,
      stack: ['React Native', 'Expo', 'GraphQL', 'Recharts'],
      images: ['/public/uploads/analytics-1.png', '/public/uploads/analytics-2.png'],
      ru: {
        name: 'Аналитика продаж',
        description:
          'Мобильное приложение для владельцев кассовых сетей: выручка по точкам, средний чек, топ товаров и рейтинг кассиров. Данные обновляются в реальном времени.',
      },
      en: {
        name: 'Sales Analytics',
        description:
          'A mobile app for POS network owners: revenue by location, average check, top products and a cashier leaderboard. Data updates in real time.',
      },
    },
    {
      order: 3,
      repoUrl: 'https://github.com/1mposs1blyt/booking-widget',
      liveUrl: 'https://example.com/booking',
      stack: ['Next.js', 'TypeScript', 'Prisma'],
      images: [],
      ru: {
        name: 'Виджет бронирования',
        description:
          'Встраиваемый виджет записи для салонов и клиник: выбор мастера, свободных слотов и услуги, уведомления в Telegram.',
      },
      en: {
        name: 'Booking Widget',
        description:
          'An embeddable booking widget for salons and clinics: pick a specialist, an available slot and a service, with Telegram notifications.',
      },
    },
  ];

  const createdProjects: { id: string; name: string }[] = [];

  for (const p of projects) {
    const created = await prisma.project.create({
      data: {
        profileId: profile.id,
        repoUrl: p.repoUrl,
        liveUrl: p.liveUrl,
        stack: p.stack,
        order: p.order,
        projectTranslations: {
          create: [
            { language: Language.RU, name: p.ru.name, description: p.ru.description },
            { language: Language.EN, name: p.en.name, description: p.en.description },
          ],
        },
        images: {
          create: p.images.map((url, order) => ({ url, order })),
        },
      },
    });
    createdProjects.push({ id: created.id, name: p.ru.name });
  }
  console.log('— проекты и изображения');

  // ---------- ОТЗЫВЫ ----------

  const reviews = [
    {
      type: ReviewType.CLIENT,
      authorName: 'Мария Ковалёва',
      company: 'Coffee Point',
      rating: 5,
      projectIndex: 1,
      ru: { position: 'Владелица сети', text: 'Кассовое приложение закрыло все наши задачи, а правки вносились в тот же день. Отдельно порадовало, что всё работает без интернета.' },
      en: { position: 'Chain owner', text: 'The POS app covered everything we needed, and fixes landed the same day. The offline mode was a particularly nice touch.' },
    },
    {
      type: ReviewType.CLIENT,
      authorName: 'Дмитрий Орлов',
      company: 'Studio Nine',
      rating: 5,
      projectIndex: 3,
      ru: { position: 'Управляющий', text: 'Виджет бронирования встроили за вечер, клиенты разобрались без объяснений. Записей стало заметно больше.' },
      en: { position: 'Manager', text: 'The booking widget took one evening to embed and clients figured it out with no instructions. Bookings went up noticeably.' },
    },
    {
      type: ReviewType.EMPLOYER,
      authorName: 'Игорь Савельев',
      company: 'SoftTrade',
      rating: 5,
      projectIndex: null,
      ru: { position: 'Тимлид', text: 'Александр берёт задачу целиком, вместе с непонятными краями, и доводит до результата. Код читаемый, ревью проходит быстро.' },
      en: { position: 'Team Lead', text: 'Alexander takes ownership of a task, murky edges included, and sees it through. His code is readable and reviews go quickly.' },
    },
    {
      type: ReviewType.EMPLOYER,
      authorName: 'Анна Лебедева',
      company: 'ITL Group',
      rating: 4,
      projectIndex: null,
      ru: { position: 'Руководитель разработки', text: 'Пришёл джуном, за полгода вырос до самостоятельной работы над сервисами. Не боится задавать вопросы и разбираться в чужом коде.' },
      en: { position: 'Head of Development', text: 'Joined as a junior and within six months was running services on his own. Not afraid to ask questions or dig into unfamiliar code.' },
    },
  ];

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        type: r.type,
        authorName: r.authorName,
        company: r.company,
        rating: r.rating,
        projectId: r.projectIndex !== null ? createdProjects[r.projectIndex].id : null,
        reviewTranslations: {
          create: [
            { language: Language.RU, position: r.ru.position, text: r.ru.text },
            { language: Language.EN, position: r.en.position, text: r.en.text },
          ],
        },
      },
    });
  }
  console.log('— отзывы');

  // ---------- ТОКЕНЫ ----------

  const day = 24 * 60 * 60 * 1000;
  await prisma.reviewToken.createMany({
    data: [
      { type: ReviewType.CLIENT, projectId: createdProjects[0].id, isUsed: false, expiresAt: new Date(Date.now() + 30 * day) },
      { type: ReviewType.CLIENT, projectId: createdProjects[2].id, isUsed: true, expiresAt: new Date(Date.now() + 14 * day) },
      { type: ReviewType.EMPLOYER, projectId: null, isUsed: false, expiresAt: new Date(Date.now() + 7 * day) },
      { type: ReviewType.EMPLOYER, projectId: null, isUsed: false, expiresAt: new Date(Date.now() - 2 * day) },
    ],
  });
  console.log('— токены отзывов');
}

async function main() {
  await wipe();
  await seed();
  console.log('\nГотово. Всё создано в двух языках.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());