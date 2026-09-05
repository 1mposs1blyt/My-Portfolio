export const DEMO_PROFILE = {
  id: "demo-profile",
  name: "Иван Иванов",
  headline: "Full-stack разработчик — Node.js, TypeScript, React",
  description: "Так выглядит описание профиля. В демо-режиме все данные вымышленные, а правки живут только до перезагрузки страницы.",
  location: "Remote",
  email: "demo@example.com"
};
export const DEMO_SKILLS = [{
  id: "demo-s1",
  name: "TypeScript",
  category: "LANGUAGE",
  level: 5,
  order: 0
}, {
  id: "demo-s2",
  name: "SQL",
  category: "LANGUAGE",
  level: 4,
  order: 1
}, {
  id: "demo-s3",
  name: "React",
  category: "FRONTEND",
  level: 5,
  order: 2
}, {
  id: "demo-s4",
  name: "React Native",
  category: "FRONTEND",
  level: 4,
  order: 3
}, {
  id: "demo-s5",
  name: "Node.js",
  category: "BACKEND",
  level: 5,
  order: 4
}, {
  id: "demo-s6",
  name: "NestJS",
  category: "BACKEND",
  level: 4,
  order: 5
}, {
  id: "demo-s7",
  name: "PostgreSQL",
  category: "DATABASE",
  level: 4,
  order: 6
}, {
  id: "demo-s8",
  name: "Docker",
  category: "INFRA",
  level: 3,
  order: 7
}, {
  id: "demo-s9",
  name: "Git",
  category: "TOOL",
  level: 5,
  order: 8
}];
export const DEMO_LINKS = [{
  id: "demo-l1",
  kind: "GITHUB",
  label: "example",
  url: "https://github.com/",
  order: 0
}, {
  id: "demo-l2",
  kind: "TELEGRAM",
  label: "@example",
  url: "https://t.me/",
  order: 1
}, {
  id: "demo-l3",
  kind: "EMAIL",
  label: "demo@example.com",
  url: "mailto:demo@example.com",
  order: 2
}, {
  id: "demo-l4",
  kind: "WEBSITE",
  label: "example.com",
  url: "https://example.com",
  order: 3
}];
export const DEMO_EXPERIENCE = [{
  id: "demo-e1",
  company: "Пример компании",
  position: "Full-stack разработчик",
  description: "Описание роли: за что отвечал и какие задачи решал.",
  startDate: "2025-02-01",
  endDate: null,
  achievements: [{
    id: "demo-a1",
    text: "Первое достижение — что удалось сделать",
    order: 0
  }, {
    id: "demo-a2",
    text: "Второе достижение — с измеримым результатом",
    order: 1
  }]
}, {
  id: "demo-e2",
  company: "Другая компания",
  position: "Frontend-разработчик",
  description: "Интерфейсы и интеграции со сторонними сервисами.",
  startDate: "2023-05-01",
  endDate: "2025-01-01",
  achievements: [{
    id: "demo-a3",
    text: "Пример достижения",
    order: 0
  }]
}];
export const DEMO_PROJECTS = [{
  id: "demo-p1",
  name: "Первый проект",
  description: "Описание проекта: что это, для кого и какую задачу решает. В демо-режиме текст вымышленный.",
  repoUrl: "https://github.com/",
  liveUrl: "https://example.com",
  stack: ["TypeScript", "React", "Node.js"],
  order: 0,
  images: []
}, {
  id: "demo-p2",
  name: "Второй проект",
  description: "У этого проекта нет демо — на карточке будет только ссылка на код.",
  repoUrl: "https://github.com/",
  liveUrl: null,
  stack: ["NestJS", "PostgreSQL", "Prisma"],
  order: 1,
  images: []
}, {
  id: "demo-p3",
  name: "Третий проект",
  description: "Мобильное приложение. Картинки в демо-режиме не загружаются.",
  repoUrl: null,
  liveUrl: null,
  stack: ["React Native", "TypeScript"],
  order: 2,
  images: []
}];
export const DEMO_REVIEWS = [{
  id: "demo-r1",
  type: "CLIENT",
  authorName: "Пётр Петров",
  company: "Пример компании",
  position: "Product Owner",
  text: "Пример отзыва заказчика. Настоящие отзывы приходят по одноразовым ссылкам.",
  rating: 5,
  projectId: "demo-p1",
  createdAt: "2026-07-15T10:00:00.000Z"
}, {
  id: "demo-r2",
  type: "EMPLOYER",
  authorName: "Мария Сидорова",
  company: "Другая компания",
  position: "Team Lead",
  text: "Пример рекомендации от работодателя.",
  rating: null,
  projectId: null,
  createdAt: "2026-05-02T10:00:00.000Z"
}];
export const DEMO_REVIEW_TOKENS: unknown[] = [];