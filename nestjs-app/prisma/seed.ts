import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import {
  PrismaClient,
  Language,
  LinkKind,
  SkillCategory,
} from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Данные восстановлены из дампа продовой базы от 07.09.2026.
// id сохранены оригинальные — иначе отвяжутся загруженные картинки в /public/uploads.

async function wipe() {
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
  console.log("— база очищена");
}

async function seed() {
  const profile = await prisma.profile.create({
    data: {
      id: "37ae8e99-635d-48eb-8061-e7d57c56cc57",
      email: "alexandr.bryaginya@gmail.com",
      profileTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Александр Брягиня",
            headline: "Full-stack software developer",
            description:
              "Делаю продукты целиком: бэкенд на NestJS с GraphQL и Prisma, интерфейсы на React, десктоп и мобильные приложения. Много работал с интеграциями — кассовые системы, сервис-деск, мессенджеры: беру чужой API и превращаю его в инструмент, которым пользуются каждый день.",
            location: "Новосибирск, Россия",
          },
          {
            language: Language.EN,
            name: "Alexandr Bryaginya",
            headline: "Full-stack software developer",
            description:
              "I build products end to end: NestJS with GraphQL and Prisma on the backend, React interfaces, desktop and mobile apps. I've done a lot of integration work — POS systems, service desks, messengers: I take someone else's API and turn it into a tool people use every day.",
            location: "Novosibirsk, Russia",
          },
        ],
      },
      links: {
        create: [
          {
            id: "b0462778-22a9-47a7-b909-d02f5b4c3d31",
            kind: LinkKind.GITHUB,
            label: "@1mposs1blyt",
            url: "https://github.com/1mposs1blyt",
            order: 0,
          },
          {
            id: "ee6c14f1-9afd-4c5f-97d0-d653e6249020",
            kind: LinkKind.TELEGRAM,
            label: "@alexandr_st54_nsk",
            url: "https://t.me/alexandr_st54_nsk",
            order: 1,
          },
          {
            id: "a2d7fe0c-fe31-47c8-a174-72c04b3aa227",
            kind: LinkKind.TELEGRAM,
            label: "@my_portfolio",
            url: "https://t.me/flru_mywork",
            order: 2,
          },
          {
            id: "690c8646-d281-447c-a094-4925614f6d21",
            kind: LinkKind.EMAIL,
            label: "@alexandr.bryaginya",
            url: "mailto:alexandr.bryaginya@gmail.com",
            order: 3,
          },
          {
            id: "edd92a9c-5055-4e75-a2b0-c795e27b58f0",
            kind: LinkKind.WEBSITE,
            label: "@hh.ru",
            url: "https://novosibirsk.hh.ru/resume/1c572010ff1109977d0039ed1f725038486f36",
            order: 4,
          },
          {
            id: "44787e20-7eec-4df3-bfbe-ba14c88a0bda",
            kind: LinkKind.WEBSITE,
            label: "@zarplata.ru",
            url: "https://novosibirsk.zarplata.ru/resume/bae5dd57ff110964760039ed1f454e72333631",
            order: 5,
          },
        ],
      },
      skills: {
        create: [
          {
            id: "609adad5-d93f-4e4d-80b9-2db0e6d30a5d",
            name: "TypeScript",
            category: SkillCategory.LANGUAGE,
            level: 4,
            order: 0,
          },
          {
            id: "058b266e-dfe1-4df5-9d23-01b7dcc96fd4",
            name: "JavaScript",
            category: SkillCategory.LANGUAGE,
            level: 4,
            order: 1,
          },
          {
            id: "bfca7f0c-232d-4e80-aa90-a637c13b7b1c",
            name: "Docker",
            category: SkillCategory.TOOL,
            level: 3,
            order: 2,
          },
          {
            id: "6f6f3ea6-e281-417e-9ad4-595c7d53c0e8",
            name: "SQL",
            category: SkillCategory.LANGUAGE,
            level: 3,
            order: 3,
          },
          {
            id: "41210928-fe33-4a8c-b076-a4dbc5c9a2cd",
            name: "React",
            category: SkillCategory.FRONTEND,
            level: 4,
            order: 4,
          },
          {
            id: "42d9e63e-8263-4aba-9b12-7750b3ca4dde",
            name: "React Native",
            category: SkillCategory.FRONTEND,
            level: 4,
            order: 5,
          },
          {
            id: "cabf3baa-6363-4767-9ef6-bee4bdbca4f6",
            name: "Next.js",
            category: SkillCategory.FRONTEND,
            level: 4,
            order: 6,
          },
          {
            id: "d910817c-2611-4162-bcee-4012a650ccc2",
            name: "Tailwind",
            category: SkillCategory.FRONTEND,
            level: 5,
            order: 7,
          },
          {
            id: "6c792fad-ce2c-451b-86b6-fad54f86eaf5",
            name: "PostgreSQL",
            category: SkillCategory.DATABASE,
            level: 3,
            order: 8,
          },
          {
            id: "2107ca55-9b44-453a-b10b-79f714d4b6a7",
            name: "Prisma",
            category: SkillCategory.DATABASE,
            level: 3,
            order: 9,
          },
          {
            id: "85dcea78-a659-45c3-b8ef-6b330ad329f5",
            name: "SQLite",
            category: SkillCategory.DATABASE,
            level: 3,
            order: 10,
          },
          {
            id: "0e5c8612-e7c3-43fd-8c43-3aa779c82256",
            name: "nginx",
            category: SkillCategory.INFRA,
            level: 3,
            order: 11,
          },
          {
            id: "71fa04d5-55b4-45c4-92cc-55a66d559ea4",
            name: "Git",
            category: SkillCategory.TOOL,
            level: 3,
            order: 12,
          },
          {
            id: "c5f5d32c-8167-4637-9634-5a9218d9a508",
            name: "Electron",
            category: SkillCategory.FRONTEND,
            level: 3,
            order: 13,
          },
        ],
      },
    },
  });
  console.log("— профиль, ссылки, навыки");

  // ---------------------------------------------------------------- опыт

  await prisma.experience.create({
    data: {
      id: "d38773a6-bebc-49bf-9c75-464bb867be7d",
      profileId: profile.id,
      company: "SoftTrade | ООО Трейд Плюс",
      startDate: new Date("2024-08-19"),
      endDate: null,
      experienceTranslations: {
        create: [
          {
            language: Language.RU,
            position: "Инженер программист | Основное подразделение",
            description:
              "Разработка веб- и мобильных сервисов, интеграции со сторонними API.",
          },
          {
            language: Language.EN,
            position: "Software Engineer | Core division",
            description:
              "Building web and mobile services, integrations with third-party APIs.",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "2c960cba-1a5c-4dbb-8f8a-22f944a67738",
      experienceId: "d38773a6-bebc-49bf-9c75-464bb867be7d",
      order: 0,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Разработал сервисы учёта и интеграции с фискальными регистраторами",
          },
          {
            language: Language.EN,
            text: "Built accounting services and integrations with fiscal registrars",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "dc9043b4-78d4-48f5-bced-42c6512f75f7",
      experienceId: "d38773a6-bebc-49bf-9c75-464bb867be7d",
      order: 1,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Спроектировал GraphQL API для цифровых систем управления",
          },
          {
            language: Language.EN,
            text: "Designed a GraphQL API for digital management systems",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "64079836-77b2-48fc-bbe8-68256ad34be8",
      experienceId: "d38773a6-bebc-49bf-9c75-464bb867be7d",
      order: 2,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Связал сервис-деск Okdesk с мессенджерами: заявки создаются и отслеживаются из чата",
          },
          {
            language: Language.EN,
            text: "Connected the Okdesk service desk to messengers: tickets are created and tracked from chat",
          },
        ],
      },
    },
  });
  await prisma.experience.create({
    data: {
      id: "90038df5-1b31-42c3-aa43-0dd0fbc61dba",
      profileId: profile.id,
      company: "Фриланс | Freelance",
      startDate: new Date("2023-09-06"),
      endDate: null,
      experienceTranslations: {
        create: [
          {
            language: Language.RU,
            position: "Full-Stack разработчик",
            description:
              "Заказы под ключ: веб-сервисы, телеграм-боты, инструменты автоматизации для малого бизнеса.",
          },
          {
            language: Language.EN,
            position: "Full-Stack Developer",
            description:
              "End-to-end freelance work: web services, Telegram bots, automation tools for small businesses.",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "8c7e178d-5212-4f3d-ac6a-8aaeefb0bdf5",
      experienceId: "90038df5-1b31-42c3-aa43-0dd0fbc61dba",
      order: 0,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Автоматизировал перенос почтовых архивов в отчёты с классификацией через LLM",
          },
          {
            language: Language.EN,
            text: "Automated conversion of mail archives into reports with LLM-based classification",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "6fb9c770-57cf-413e-bf57-efc73b975ecb",
      experienceId: "90038df5-1b31-42c3-aa43-0dd0fbc61dba",
      order: 1,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Разработал платформу тренажёров и бота подбора программ для языковой школы",
          },
          {
            language: Language.EN,
            text: "Built a drill platform and a course-matching bot for a language school",
          },
        ],
      },
    },
  });
  await prisma.achievement.create({
    data: {
      id: "613f0ec9-c754-463e-8fd1-10b7e71dd1fe",
      experienceId: "90038df5-1b31-42c3-aa43-0dd0fbc61dba",
      order: 2,
      achievementTranslations: {
        create: [
          {
            language: Language.RU,
            text: "Заменил PHP-скрипт конвертации характеристик товаров при переезде сайта на новый движок",
          },
          {
            language: Language.EN,
            text: "Replaced a PHP product-spec conversion script during a site migration",
          },
        ],
      },
    },
  });
  console.log("— опыт и достижения");

  // --------------------------------------------------------------- проекты

  await prisma.project.create({
    data: {
      id: "fe2d9ec2-3a6d-4284-ac6a-6df859714cdb",
      profileId: profile.id,
      repoUrl: "https://github.com/1mposs1blyt/saveur-booking-task",
      liveUrl:
        "https://saveur-booking-task-g2m7u3rj6-1mposs1blyts-projects.vercel.app/",
      stack: [
        "Next.js",
        "React",
        "TypeScript",
        "React Hook Form",
        "Zod",
        "Tailwind",
        "Framer Motion",
      ],
      order: 0,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "SaveurBooking — форма бронирования столика",
            description:
              "Тестовое задание для Saveur Studio: бронирование с валидацией на клиенте и защитой от заведомо невозможных дат. Правила вынесены в схемы Zod, форма на неконтролируемых полях React Hook Form — ввод без задержек и лишних ререндеров. Временные слоты генерируются от текущего момента: прошедшие часы сегодняшнего дня недоступны, горизонт брони ограничен 90 днями. Маска телефона форматирует номер прямо при вводе.",
          },
          {
            language: Language.EN,
            name: "SaveurBooking — table reservation form",
            description:
              "Test assignment for Saveur Studio: a booking form with client-side validation and protection against impossible dates. Rules live in Zod schemas; the form uses React Hook Form uncontrolled fields, so typing is instant with no extra re-renders. Time slots are generated from the current moment: past hours of the current day are unavailable and the booking horizon is capped at 90 days. A phone mask formats the number as you type.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "6c4fb900-5568-48bc-981f-a1d5ddd4f8e5",
            url: "/public/uploads/5b6282109290419d2be7ed2e0b0fff22.png",
            order: 0,
          },
          {
            id: "41de2fa0-7030-4b4c-b9ee-d1e4bf7eeda7",
            url: "/public/uploads/ea1a963dfcf1046fce08a29fb3c6932e.png",
            order: 1,
          },
          {
            id: "041de60c-9a2c-44bb-a3ee-17078e5607e3",
            url: "/public/uploads/24a3a8710119e0e0023eeb426ec8ffed.png",
            order: 2,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "c64c7953-e450-4322-b55c-06d2466db56d",
      profileId: profile.id,
      repoUrl: "https://github.com/1mposs1blyt/moto-voice-chat",
      liveUrl: null,
      stack: [
        "React Native",
        "Expo",
        "WebRTC",
        "Zeroconf",
        "UDP",
        "NativeWind",
      ],
      order: 1,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Moto-voice-chat",
            description:
              "Голосовая рация для байкеров в поездках без мобильной связи: телефоны соединяются через Wi-Fi-хотспот, интернет и сервер не нужны. Устройства находят друг друга сами через Zeroconf, аудио идёт по WebRTC с шумо- и эхоподавлением, сигналинг — напрямую по UDP между телефонами. Требует нативной сборки: задействованы модули микрофона и сети. В разработке.",
          },
          {
            language: Language.EN,
            name: "Moto-voice-chat",
            description:
              "A voice intercom for bikers riding out of cell coverage: phones connect over a Wi-Fi hotspot, no internet or server required. Devices discover each other via Zeroconf, audio runs over WebRTC with noise and echo suppression, and signalling goes directly over UDP between phones. Requires a native build — microphone and network modules are involved. Work in progress.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "36520810-698f-489b-a99b-66bcd3980442",
            url: "/public/uploads/69f3ea7a2b7f56f72074470bab0dd9aa.jpg",
            order: 0,
          },
          {
            id: "322a8490-c00d-4789-89f9-de2e32f803d0",
            url: "/public/uploads/106179858254fb5c959c53c0624bb198.jpg",
            order: 1,
          },
          {
            id: "8921367c-4ae8-4a8a-8d05-7f82d101b041",
            url: "/public/uploads/d952bfbf035af9602cdb5c195896862e.jpg",
            order: 2,
          },
          {
            id: "81ce79ef-ec4a-4d2a-b1a6-b58d6154cbf9",
            url: "/public/uploads/a157fe07687cd7f00ce84d8bcd709b67.jpg",
            order: 3,
          },
          {
            id: "2f81b2f7-1313-4715-9fc6-659fb80cea9a",
            url: "/public/uploads/108d9822b8714a6cfd1fad2d1e3832c6.jpg",
            order: 4,
          },
          {
            id: "72de9fa5-d144-48ec-a396-90817f926f0d",
            url: "/public/uploads/2934687bf7ad8a59e4b28d6dec273442.jpg",
            order: 5,
          },
          {
            id: "9f255ef9-d4e1-4dd7-9436-3acfb21a2390",
            url: "/public/uploads/b705e98b218747d293d78c95db7e6ede.jpg",
            order: 6,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "fd504868-3484-4bbb-b26e-1ea3dc0f2f42",
      profileId: profile.id,
      repoUrl: "https://github.com/1mposs1blyt/ElectronJS",
      liveUrl: null,
      stack: ["Electron", "Node.js", "Socket.IO", "SQLite"],
      order: 2,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Telegram Bot Manager — панель управления ботами",
            description:
              "Десктопное приложение для управления ботами на удалённых серверах: запуск, остановка, статус и поток входящих сообщений в реальном времени. Подключение к серверам по SSH, команды и логи идут через сокет, конфигурация ботов хранится локально в SQLite. Собирается под Windows, Linux и macOS, ставится как обычное приложение или запускается портативно из папки.",
          },
          {
            language: Language.EN,
            name: "Telegram Bot Manager — bot control panel",
            description:
              "A desktop app for managing bots on remote servers: start, stop, status, and a live feed of incoming messages. Servers are reached over SSH, commands and logs travel through a socket, and bot configuration is stored locally in SQLite. Builds for Windows, Linux and macOS, and installs as a regular application or runs portably from a folder.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "987ff36e-d1df-4b5c-b9cb-3ea559fdb914",
            url: "/public/uploads/5b4da0464dd5c66db46584c9d82d0a37.jpg",
            order: 0,
          },
          {
            id: "61294706-5f8d-4dcd-b43f-64cf189a8edc",
            url: "/public/uploads/0115b830deb12e6a3c61ccf6c66c7dc6.jpg",
            order: 1,
          },
          {
            id: "8a8e2a75-bfc4-4bfc-926a-0beede338122",
            url: "/public/uploads/bc23ac933170a88b4fdb4c47c7947609.jpg",
            order: 2,
          },
          {
            id: "97591a97-7b3f-4ac6-8bdc-fe6d45699870",
            url: "/public/uploads/28f11bac087a9fd640543e78bc0e00f4.jpg",
            order: 3,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "05b0134c-b7f1-4991-a962-115a41f5f5ce",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "Telegram Bot API", "Okdesk API"],
      order: 3,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Бот заявок Telegram/Max → Okdesk",
            description:
              "Заявки в сервис-деск создаются прямо из телеграма, без перехода в интерфейс Okdesk. Бот переносит текст и вложения, а автора определяет по username и сам подставляет его в нужные поля Okdesk API — заявка приходит уже привязанной к конкретному клиенту. Позже переписан под мессенджер MAX — бизнес-логика вынесена из транспортного слоя, так что смена платформы затронула только адаптер отправки.",
          },
          {
            language: Language.EN,
            name: "Telegram/Max → Okdesk ticket bot",
            description:
              "Service-desk tickets are created straight from Telegram, without opening the Okdesk interface. The bot carries over the text and attachments, identifies the author by username and fills in the matching Okdesk API fields — so the ticket arrives already linked to the right client. Later rewritten for the MAX messenger: business logic sits outside the transport layer, so switching platforms only touched the sending adapter.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "7ab3ab1b-1ddd-4ff5-989e-2a014a5e2432",
            url: "/public/uploads/151c3422121b2ea73ed3bd8afe6ec12a.jpg",
            order: 0,
          },
          {
            id: "db4e6ffd-cd20-4b94-b715-c3dac7c8f63d",
            url: "/public/uploads/5d0512dcc6a17fd1cb630385fd1bad39.jpg",
            order: 1,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "4faad203-5d8e-4e5b-b57d-a239181058f9",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "Express", "Okdesk Webhooks", "Telegram Bot API"],
      order: 4,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Уведомления Okdesk → Telegram",
            description:
              "Заявки без ответственного не теряются: бот принимает вебхук от Okdesk, фильтрует события по статусу и присылает в рабочий чат карточку с заголовком, описанием и ссылками на исходное сообщение и автора. Обратная сторона к боту создания заявок — вместе они замыкают цикл.",
          },
          {
            language: Language.EN,
            name: "Okdesk → Telegram notifications",
            description:
              "Unassigned tickets no longer slip through: the bot receives an Okdesk webhook, filters events by status and posts a card into the team chat with the title, description and links to the original message and its author. The counterpart to the ticket-creation bot — together they close the loop.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "1060926a-0611-4a70-ac50-a6e2db0575fe",
            url: "/public/uploads/ac4562bf3bbe7ac4869059b055737aa6.png",
            order: 0,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "457a4d0c-e9b7-46be-825b-856847601a04",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "TypeScript", "Inquirer", "xlsx", "mbox-parser"],
      order: 5,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "mbox → xlsx с классификацией писем",
            description:
              "Разбирает архив почты из Thunderbird в таблицу с готовыми категориями. Конвейер из трёх шагов: парсинг mbox в JSON, определение категории письма через LLM по теме и тексту, сборка xlsx. Промежуточные результаты сохраняются в файлы, поэтому дорогой шаг классификации не повторяется при перезапуске. Собран в самостоятельный .exe с интерактивным меню и настройкой через .env — заказчику не нужен установленный Node.",
          },
          {
            language: Language.EN,
            name: "mbox → xlsx with email classification",
            description:
              "Turns a Thunderbird mail archive into a spreadsheet with ready-made categories. A three-step pipeline: parse mbox into JSON, classify each email with an LLM based on subject and body, then build the xlsx. Intermediate results are written to files, so the expensive classification step isn't repeated on restart. Ships as a standalone .exe with an interactive menu and .env configuration — the client doesn't need Node installed.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "ad78b514-1263-4663-a2d2-dcddb3bef056",
            url: "/public/uploads/f2c744233ad8fff1b987b0e2684dfeef.jpg",
            order: 0,
          },
          {
            id: "124ad291-0aff-45e4-8526-bbfd32c415b5",
            url: "/public/uploads/05c4d7f53c666b601bd21ee7fd994b34.jpg",
            order: 1,
          },
          {
            id: "a9888a76-0e4b-4ce3-aef4-95b0bd79654b",
            url: "/public/uploads/22bf6929c9f558295f08e9da32b240c6.jpg",
            order: 2,
          },
          {
            id: "1a0d5b2f-dff1-4b32-8811-b9e58823abe1",
            url: "/public/uploads/80e5b3f17218acba7521ba9825077a7a.jpg",
            order: 3,
          },
          {
            id: "5b189f10-82f4-415b-813b-b7194d9d8030",
            url: "/public/uploads/58e2d0e58a11589dda50cd612d9e754f.jpg",
            order: 4,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "1dd26b76-cbbe-47d7-b05c-0a9c9b8fee5d",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "Express", "jQuery", "xlsx"],
      order: 6,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Мост 1С → iikoChain",
            description:
              "Убрал ручной перенос номенклатуры между 1С и iikoChain. Парсинг xlsx на сервере, маппинг полей в формат iiko API, пакетная отправка актов приготовления с обработкой частичных отказов.",
          },
          {
            language: Language.EN,
            name: "1C → iikoChain bridge",
            description:
              "Eliminated manual transfer of product catalogues between 1C and iikoChain. Server-side xlsx parsing, field mapping into the iiko API format, and batch submission of preparation records with handling for partial failures.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "69041d30-3d5a-4df2-81b1-50afa042ca73",
            url: "/public/uploads/f02892fbb7e25ba142e27946d68a50ef.jpg",
            order: 0,
          },
          {
            id: "8b53ffec-8582-44bb-a11e-6e586e2ab318",
            url: "/public/uploads/b9de4216283945711bb9152c6cfc24d3.jpg",
            order: 1,
          },
          {
            id: "0eac8c85-844a-4cc4-aa2d-e641684e060c",
            url: "/public/uploads/2b29b94e2fc04de3b22e3d5bd683c97a.jpg",
            order: 2,
          },
          {
            id: "5902f06d-49ca-4e2b-8d0c-0dcf35c6371a",
            url: "/public/uploads/28554b39eecdc67b9deb4cf09315dcba.jpg",
            order: 3,
          },
          {
            id: "8958f4ac-f51d-492e-8c1d-3f35ea4b19b3",
            url: "/public/uploads/2910a6b52eb7d7492566fda4af16d8ad.jpg",
            order: 4,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "9c6fc6f4-d1ae-4fc8-a2a7-13b2fd18f888",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "Express", "Bootstrap 5"],
      order: 7,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Эйн&Штейн — платформа устного счёта",
            description:
              "Веб-платформа для школы ментальной арифметики: тренажёры устного счёта и учёт результатов учеников. Сессионная авторизация, генерация примеров по уровням сложности, серверный рендеринг на Express.",
          },
          {
            language: Language.EN,
            name: "Ein&Stein — mental arithmetic platform",
            description:
              "A web platform for a mental arithmetic school: practice drills and student progress tracking. Session-based auth, exercise generation by difficulty level, server-side rendering on Express.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "c540d6cb-8808-434d-a33a-c1b0cebd3b5e",
            url: "/public/uploads/e8b5f6b2af995c0e19d6ad24670020f6.png",
            order: 0,
          },
          {
            id: "6696d5d2-cb6d-4c21-8d54-c34ce6e12f0d",
            url: "/public/uploads/3996408c842078b6c7b710a69a769841.jpg",
            order: 1,
          },
          {
            id: "4e9bd3c3-13e8-44a9-b62f-499aaa78400a",
            url: "/public/uploads/11c813b189ee32c00c5789713e6d081a.jpg",
            order: 2,
          },
          {
            id: "3d454f49-66c9-4c81-8e83-43b2b54936a5",
            url: "/public/uploads/c515e016f58bbe7e4a44da60aad11434.jpg",
            order: 3,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "c1455a8c-5473-4138-b502-2cb4488ed953",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "xlsx"],
      order: 8,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Конвертер характеристик товаров в HTML",
            description:
              "Заменил PHP-скрипт при переезде сайта на другой движок: разбирает выгрузку xlsx, где характеристики товара лежат одной строкой с разделителями, и собирает из них готовую HTML-таблицу в отдельной колонке. Обработка идёт пакетно по всему файлу, результат сразу пригоден для импорта в новую CMS.",
          },
          {
            language: Language.EN,
            name: "Product spec to HTML converter",
            description:
              "Replaced a PHP script during a site migration to a different engine: it parses an xlsx export where product specs sit in a single delimited string and assembles a ready HTML table in a separate column. Processing runs in batch across the whole file, and the result can be imported into the new CMS as is.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "bada8f90-13a9-4829-8da0-123453d0b945",
            url: "/public/uploads/fde3386128f259974db56f34c8b95afc.jpg",
            order: 0,
          },
          {
            id: "fbfb9788-6ec3-494f-9bcb-78e5c69c5ed2",
            url: "/public/uploads/47012517a6fbbfa356ac3bd68ce05c87.jpg",
            order: 1,
          },
          {
            id: "f0776736-1d5b-40c4-b36a-c1038858a9d7",
            url: "/public/uploads/c6fdc8cd15c773d4c2c393f4bd097efa.jpg",
            order: 2,
          },
          {
            id: "6dfe148c-c516-489b-aa89-3787cdf4ab22",
            url: "/public/uploads/245bcdfef18f21b3d333ba0ad80b8d4a.jpg",
            order: 3,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "eb851e4e-0d11-41c4-90f0-583b9365f611",
      profileId: profile.id,
      repoUrl: null,
      liveUrl: null,
      stack: ["Node.js", "Express", "SQLite"],
      order: 9,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Одностраничный сайт для студента",
            description:
              "Одностраничный сайт с каталогом объектов и хранением данных в SQLite. Сделан как учебный проект: помимо кода — разбор реализации, чтобы заказчик мог поддерживать сайт сам.",
          },
          {
            language: Language.EN,
            name: "Single-page site for a student",
            description:
              "A single-page site with a catalogue of listings and data stored in SQLite. Built as a learning project: alongside the code, a walkthrough of the implementation so the client could maintain the site themselves.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "b3a5c019-bc84-45a8-a29e-5b7f322882f2",
            url: "/public/uploads/b532774ae0cd8bc88ea9088d483d4539.png",
            order: 0,
          },
          {
            id: "32c76beb-0441-410f-b536-6bc42ffbcce2",
            url: "/public/uploads/54059c6e01185c456d00e8a711200f7f.png",
            order: 1,
          },
        ],
      },
    },
  });
  await prisma.project.create({
    data: {
      id: "16a3bda3-67b6-4a26-932e-25cbab788e3d",
      profileId: profile.id,
      repoUrl: "https://github.com/1mposs1blyt/My-Portfolio",
      liveUrl: null,
      stack: [
        "TypeScript",
        "React",
        "Vite",
        "urql",
        "NestJS",
        "GraphQL",
        "Prisma",
        "PostgreSQL",
        "Docker",
        "nginx",
      ],
      order: 10,
      projectTranslations: {
        create: [
          {
            language: Language.RU,
            name: "Это портфолио",
            description:
              "Сайт вместе с админкой. Контент лежит в PostgreSQL, отдаётся через GraphQL, редактируется через /admin — она открыта всем в демо-режиме: формы, валидация и загрузка работают, но правки живут только в вашей вкладке. Запись в базу открывает токен в заголовке, проверка на бэкенде через timing-safe сравнение хешей. Отзывы собираются по одноразовым ссылкам с ограниченным сроком жизни. Всё поднимается одной командой в Docker: Postgres, NestJS и nginx.",
          },
          {
            language: Language.EN,
            name: "This portfolio",
            description:
              "The site along with its admin panel. Content lives in PostgreSQL, is served over GraphQL and edited through /admin — which is open to everyone in demo mode: forms, validation and uploads all work, but changes only live in your own tab. Writing to the database requires a token in the header, verified on the backend with a timing-safe hash comparison. Reviews are collected through single-use links with a limited lifetime. Everything comes up with one Docker command: Postgres, NestJS and nginx.",
          },
        ],
      },
      images: {
        create: [
          {
            id: "f029987c-4c59-4e1a-ba09-4fdf57a8e646",
            url: "/public/uploads/43a99d4f451577c249643bda649791a6.png",
            order: 0,
          },
        ],
      },
    },
  });
  console.log("— проекты и изображения");
}

async function main() {
  await wipe();
  await seed();
  console.log("\nГотово. Контент восстановлен на RU и EN.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());