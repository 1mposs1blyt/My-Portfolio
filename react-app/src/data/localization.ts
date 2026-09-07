import { plural } from "../lib/plural";
export const getLocalization = (projectsCount: number, userName: string, userHeadline: string, reviewsCount: number = 0) => ({
  ru: {
    tree: [{
      id: "about",
      file: "about.md"
    }, {
      id: "projects",
      file: "projects/",
      count: projectsCount
    }, {
      id: "reviews",
      file: "reviews.log",
      count: reviewsCount
    }, {
      id: "skills",
      file: "skills.json"
    }, {
      id: "experience",
      file: "experience.log"
    }, {
      id: "contacts",
      file: "contacts.ts"
    }],
    script: [{
      cmd: "npm run dev",
      out: ["ready — портфолио запущено на :3000"]
    }, {
      cmd: "whoami",
      out: [`${userName} — ${userHeadline.toLowerCase()}`]
    }, {
      cmd: "open projects/",
      out: [`${plural(projectsCount, {
        one: "проект",
        few: "проекта",
        many: "проектов"
      }, "ru")}`]
    }],
    headings: {
      about: "Коротко о себе",
      projects: "Проекты",
      skills: "Стек",
      experience: "Опыт",
      contacts: "Контакты",
      reviews: "Отзывы заказчиков",
      recommendations: "Рекомендации работодателей & Отзывы на заказы"
    },
    categories: {
      LANGUAGE: "Языки",
      BACKEND: "Бэкенд",
      FRONTEND: "Фронтенд",
      DATABASE: "Базы данных",
      INFRA: "Инфраструктура",
      TOOL: "Инструменты"
    },
    kinds: {
      GITHUB: "GitHub",
      LINKEDIN: "LinkedIn",
      TELEGRAM: "Telegram",
      EMAIL: "Почта",
      WEBSITE: "Сайт"
    },
    demo: "Открыть демо",
    repo: "Смотреть код",
    gallery: "Скриншоты",
    shots: (n: number) => n === 1 ? "1 скриншот" : n < 5 ? n + " скриншота" : n + " скриншотов",
    noShots: "без скриншотов",
    close: "Закрыть",
    prev: "Предыдущий",
    next: "Следующий",
    present: "сейчас",
    hire: "Открыт к предложениям",
    footer: "Контент страницы приходит из базы.",
    months: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
  },
  en: {
    tree: [{
      id: "about",
      file: "about.md"
    }, {
      id: "projects",
      file: "projects/",
      count: projectsCount
    }, {
      id: "reviews",
      file: "reviews.log",
      count: reviewsCount
    }, {
      id: "skills",
      file: "skills.json"
    }, {
      id: "experience",
      file: "experience.log"
    }, {
      id: "contacts",
      file: "contacts.ts"
    }],
    script: [{
      cmd: "npm run dev",
      out: ["ready — portfolio running on :3000"]
    }, {
      cmd: "whoami",
      out: [`${userName} — ${userHeadline.toLowerCase()}`]
    }, {
      cmd: "open projects/",
      out: [`${projectsCount} projects`]
    }],
    headings: {
      about: "About",
      projects: "Projects",
      skills: "Stack",
      experience: "Experience",
      contacts: "Contacts",
      reviews: "Client Reviews",
      recommendations: "Employer Recommendations & Order's reviews"
    },
    categories: {
      LANGUAGE: "Languages",
      BACKEND: "Backend",
      FRONTEND: "Frontend",
      DATABASE: "Databases",
      INFRA: "Infrastructure",
      TOOL: "Tools"
    },
    kinds: {
      GITHUB: "GitHub",
      LINKEDIN: "LinkedIn",
      TELEGRAM: "Telegram",
      EMAIL: "Email",
      WEBSITE: "Website"
    },
    demo: "Open demo",
    repo: "View code",
    gallery: "Screenshots",
    shots: (n: number) => n === 1 ? "1 screenshot" : n + " screenshots",
    noShots: "no screenshots",
    close: "Close",
    prev: "Previous",
    next: "Next",
    present: "now",
    hire: "Open to offers",
    footer: "Page content comes from the database.",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
});
