function generateSvgMock(seed: string, i: number): string {
  let h = 2166136261;
  const s = seed + ":" + i;
  for (let k = 0; k < s.length; k++) {
    h ^= s.charCodeAt(k);
    h = Math.imul(h, 16777619);
  }
  const rand = (n: number) => Math.abs((h = Math.imul(h ^ h >>> 15, 2246822507)) % n);
  const parts = [];
  for (let r = 0; r < 6; r++) {
    const w = 90 + rand(300);
    const x = 210 + rand(40);
    parts.push(`<rect x='${x}' y='${140 + r * 50}' width='${w}' height='18' fill='#8B5CF6' opacity='0.35'/>`);
  }
  const svg = `<svg xmlns='http://w3.org' viewBox='0 0 800 500' style='width:100%;height:100%;display:block;'>` + `<rect width='800' height='500' fill='#14101F'/>` + `<rect x='0' y='0' width='180' height='500' fill='#1A1428'/>` + `<rect x='24' y='40' width='120' height='14' fill='#FF3DA6' opacity='0.8'/>` + `<rect x='24' y='76' width='96' height='10' fill='#8B5CF6' opacity='0.45'/>` + `<rect x='24' y='100' width='110' height='10' fill='#8B5CF6' opacity='0.3'/>` + `<rect x='210' y='44' width='${220 + rand(180)}' height='26' fill='#FF3DA6' opacity='0.75'/>` + `<rect x='210' y='96' width='540' height='2' fill='#2A2140'/>` + parts.join("") + `<text x='760' y='470' text-anchor='end' font-family='monospace' font-size='18' fill='#7E769A'>${seed} ${i + 1}</text>` + `</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}
export const profile = {
  name: "Александр",
  headline: "Веб-разработчик — Node.js, TypeScript, React",
  description: "Делаю продукты целиком: от схемы данных и API до интерфейса, которым пользуются каждый день. Сейчас — кассовые системы и аналитика для общепита.",
  location: "Remote",
  email: "you@example.com",
  links: [{
    kind: "GITHUB",
    label: "1mposs1blyt",
    url: "https://github.com",
    order: 0
  }, {
    kind: "TELEGRAM",
    label: "@username",
    url: "https://t.me",
    order: 1
  }, {
    kind: "EMAIL",
    label: "you@example.com",
    url: "mailto:you@example.com",
    order: 2
  }, {
    kind: "LINKEDIN",
    label: "://linkedin.com…",
    url: "https://linkedin.com/",
    order: 3
  }],
  skills: [{
    name: "TypeScript",
    category: "LANGUAGE",
    level: 5,
    order: 0
  }, {
    name: "JavaScript",
    category: "LANGUAGE",
    level: 5,
    order: 1
  }, {
    name: "SQL",
    category: "LANGUAGE",
    level: 4,
    order: 2
  }, {
    name: "React",
    category: "FRONTEND",
    level: 5,
    order: 0
  }, {
    name: "React Native",
    category: "FRONTEND",
    level: 4,
    order: 1
  }, {
    name: "Next.js",
    category: "FRONTEND",
    level: 4,
    order: 2
  }, {
    name: "Node.js",
    category: "BACKEND",
    level: 5,
    order: 0
  }, {
    name: "Express",
    category: "BACKEND",
    level: 4,
    order: 1
  }, {
    name: "Prisma",
    category: "BACKEND",
    level: 4,
    order: 2
  }, {
    name: "PostgreSQL",
    category: "DATABASE",
    level: 4,
    order: 0
  }, {
    name: "Redis",
    category: "DATABASE",
    level: 3,
    order: 1
  }, {
    name: "Docker",
    category: "INFRA",
    level: 3,
    order: 0
  }, {
    name: "Tauri",
    category: "TOOL",
    level: 4,
    order: 0
  }, {
    name: "Git",
    category: "TOOL",
    level: 5,
    order: 1
  }],
  experience: [{
    company: "RestoPOS",
    position: "Full-stack разработчик",
    description: "Кассовая система для общепита: клиент кассы, сервер, интеграции с оборудованием.",
    startDate: "2026-03-01",
    endDate: null,
    achievements: [{
      text: "Подключил ККТ АТОЛ по TCP/IP вместо COM-порта — несколько касс работают с одним аппаратом",
      order: 0
    }, {
      text: "Собрал кросс-платформенный клиент на Tauri для десктопа и мобильных",
      order: 1
    }, {
      text: "Настроил сбор выгрузок с касс Frontol 6 по FTP с изоляцией данных клиентов",
      order: 2
    }]
  }, {
    company: "Мобильная разработка",
    position: "React Native разработчик",
    description: "Приложения аналитики продаж для сетей касс.",
    startDate: "2025-01-01",
    endDate: "2026-01-01",
    achievements: [{
      text: "Переработал устаревшие макеты экранов и довёл их до продакшена",
      order: 0
    }, {
      text: "Сделал вход и регистрацию по ИНН и номеру телефона",
      order: 1
    }]
  }, {
    company: "Веб-разработка",
    position: "Frontend / Node.js разработчик",
    description: "Интерфейсы, API и интеграции со сторонними сервисами.",
    startDate: "2023-06-01",
    endDate: "2025-01-01",
    achievements: [{
      text: "Собрал несколько клиентских проектов на React и Node.js",
      order: 0
    }]
  }],
  projects: [{
    id: "p1",
    name: "RestoPOS",
    description: "Кассовая система для общепита. Клиент на Tauri, ККТ АТОЛ по TCP/IP — несколько касс работают с одним аппаратом без монопольного захвата порта.",
    repoUrl: "https://github.com/RestoPOS",
    liveUrl: null,
    stack: ["TypeScript", "Tauri", "React", "Node.js"],
    order: 0,
    images: [{
      url: generateSvgMock("restopos", 0),
      order: 0
    }, {
      url: generateSvgMock("restopos", 1),
      order: 1
    }, {
      url: generateSvgMock("restopos", 2),
      order: 2
    }, {
      url: generateSvgMock("restopos", 3),
      order: 3
    }]
  }, {
    id: "p2",
    name: "Аналитика продаж",
    description: "Мобильное приложение для сетей касс: выручка по точкам, чеки, топ товаров и кассиров. Вход по ИНН и телефону.",
    repoUrl: "https://github.com",
    liveUrl: null,
    stack: ["React Native", "NativeWind", "TypeScript"],
    order: 1,
    images: [{
      url: generateSvgMock("analytics", 0),
      order: 0
    }, {
      url: generateSvgMock("analytics", 1),
      order: 1
    }, {
      url: generateSvgMock("analytics", 2),
      order: 2
    }]
  }, {
    id: "p3",
    name: "Frontol Bridge",
    description: "Сбор выгрузок с касс Frontol 6 по FTP: разбор, конвертация в JSON, изоляция данных клиентов на общем сервере.",
    repoUrl: "https://github.com",
    liveUrl: null,
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
    order: 2,
    images: [{
      url: generateSvgMock("frontol", 0),
      order: 0
    }, {
      url: generateSvgMock("frontol", 1),
      order: 1
    }]
  }, {
    id: "p4",
    name: "Название проекта",
    description: "Здесь есть liveUrl, поэтому на карточке появляется кнопка демо.",
    repoUrl: "https://github.com",
    liveUrl: "https://example.com",
    stack: ["Next.js", "Prisma"],
    order: 3,
    images: [{
      url: generateSvgMock("four", 0),
      order: 0
    }, {
      url: generateSvgMock("four", 1),
      order: 1
    }]
  }, {
    id: "p5",
    name: "Ещё один проект",
    description: "Сетка кладёт карточки по три в ряд на широком экране и по одной на телефоне.",
    repoUrl: "https://github.com",
    liveUrl: null,
    stack: ["TypeScript", "Express"],
    order: 4,
    images: [{
      url: generateSvgMock("five", 0),
      order: 0
    }]
  }, {
    id: "p6",
    name: "Проект без картинок",
    description: "Если images[] пустой, вместо обложки остаётся спокойная заглушка, карточка не кликается.",
    repoUrl: "https://github.com",
    liveUrl: null,
    stack: ["React"],
    order: 5,
    images: []
  }]
};