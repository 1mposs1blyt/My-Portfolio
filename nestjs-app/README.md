# Digital Card

Стек: NestJS + GraphQL + Prisma + CockroachDB

## Запуск

```bash
git clone https://github.com/1mposs1blyt/digital-card.git
cd digital-card
docker compose up --build
```

миграция и автосидинг происходит при старте контейнера. Apollo Sandbox -[http://localhost:3000/graphql](http://localhost:3000/graphql)

Пример запроса:

```graphql
query {
  profile {
    name
    headline
    links { kind url }
    skills { name category }
    experience { company position period achievements { text } }
    projects { name repoUrl stack }
  }
}
```

## Локальная разработка

```bash
docker compose up -d db      # только база
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

| Команда                          | Что делает                                   |
| --------------------------------------- | ----------------------------------------------------- |
| `npm run start:dev`                   | запуск с hot reload                            |
| `npm run db:migrate`                  | создать и применить миграцию |
| `npm run db:seed`                     | заполнить базу                           |
| `npm run test` / `npm run test:e2e` | тесты                                            |
| `npm run lint`                        | oxlint                                                |

## Схема данных

```
Profile ──┬─< ProfileLink
          ├─< Skill
          ├─< Project
          └─< Experience ──< Achievement
```

`Achievement` вынесен в отдельную таблицу, а не в массив строк внутри `Experience` —
это даёт второй уровень вложенности в GraphQL. `Project.stack` при этом остался
`String[]`: там нет самостоятельной сущности, только плоский список тегов.

`Experience.endDate` допускает `null` — это означает «по настоящее время».
Человекочитаемый период (`«январь 2024 — н.в.»`) вычисляется в GraphQL-слое,
в базе не хранится.

## Стек

## Решения

- **Один модуль `profile` с резолверами полей.** У Skill, Link, Project нет
  самостоятельного API вне профиля. Связи отдаются через `@ResolveField()` +
  DataLoader, а не одним `include` — число запросов к базе не растёт с выборкой.
- **`migrate deploy`, не `db push`** — история миграций в репозитории, запуск воспроизводим.
- **Идемпотентный сид** — `upsert` по уникальным ключам, повторный запуск не падает.
- **CockroachDB пин `v24.3.5`** — в 26.x схема блокируется по умолчанию, миграция Prisma
  падает с `57000`. Тег `latest` не используется нигде.
- **Prisma 7, не 8** — в восьмёрке нет CockroachDB, и она в статусе rc.
- **Не Vercel** — serverless не держит пул соединений Prisma и не даёт выполнить
  миграции при старте. Render, тем же `Dockerfile`.

TypeScript · NestJS 12 · GraphQL (code-first, Apollo Server 5) · Prisma 7 ·
CockroachDB · DataLoader · Docker · Vitest · oxlint

## Автор

Александр Брягиня — https://github.com/1mposs1blyt

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observer](https://observer.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest
