import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { AppModule } from './../src/app.module.js';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? '';

describe('Локализация RU/EN (e2e)', () => {
  let app: INestApplication;
  let http: any;

  // то, что создадим сами и в конце уберём
  const created = { projectId: '', experienceId: '', reviewId: '', tokenId: '' };
  // чтобы вернуть профиль в исходное состояние
  let originalProfile: { ru: any; en: any };

  const gql = (query: string, variables?: any, auth = false) => {
    const req = http.post('/graphql');
    if (auth) req.set('Authorization', `Bearer ${ADMIN_TOKEN}`);
    return req.send({ query, variables });
  };

  const expectNoErrors = (res: any) => {
    if (res.body.errors) {
      throw new Error(
        'GraphQL вернул ошибки: ' + JSON.stringify(res.body.errors, null, 2),
      );
    }
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // те же пайпы, что в main.ts — иначе whitelist не проверится
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    await app.init();
    http = request(app.getHttpServer());

    // запоминаем профиль, чтобы восстановить после тестов мутаций
    const [ru, en] = await Promise.all([
      gql(`query { profile(lang: RU) { name headline description location email } }`),
      gql(`query { profile(lang: EN) { name headline description location email } }`),
    ]);
    originalProfile = { ru: ru.body.data.profile, en: en.body.data.profile };
  });

  afterAll(async () => {
    // подчищаем за собой
    if (created.experienceId) {
      await gql(
        `mutation ($id: ID!) { deleteExperience(id: $id) }`,
        { id: created.experienceId },
        true,
      );
    }
    if (created.projectId) {
      await gql(
        `mutation ($id: ID!) { deleteProject(id: $id) }`,
        { id: created.projectId },
        true,
      );
    }
    if (created.reviewId) {
      await gql(
        `mutation ($id: ID!) { deleteReview(id: $id) }`,
        { id: created.reviewId },
        true,
      );
    }
    if (created.tokenId) {
      await gql(
        `mutation ($id: ID!) { revokeReviewToken(id: $id) }`,
        { id: created.tokenId },
        true,
      );
    }

    // возвращаем профиль как было
    for (const [lang, p] of [
      ['RU', originalProfile.ru],
      ['EN', originalProfile.en],
    ] as const) {
      if (!p) continue;
      await gql(
        `mutation ($input: UpdateProfileInput!) { updateProfile(input: $input) { id } }`,
        {
          input: {
            name: p.name,
            headline: p.headline,
            description: p.description,
            location: p.location,
            email: p.email,
            language: lang,
          },
        },
        true,
      );
    }

    await app.close();
  });

  // ---------------------------------------------------------------- профиль

  describe('profile', () => {
    it('отдаёт разные переводы для RU и EN', async () => {
      const [ru, en] = await Promise.all([
        gql(`query { profile(lang: RU) { id name headline description } }`),
        gql(`query { profile(lang: EN) { id name headline description } }`),
      ]);
      expectNoErrors(ru);
      expectNoErrors(en);

      const a = ru.body.data.profile;
      const b = en.body.data.profile;

      expect(a.id).toBe(b.id); // профиль один и тот же
      expect(a.name).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(a.name).not.toBe(b.name); // а переводы разные
      expect(a.headline).not.toBe(b.headline);
    });

    it('нелокализованные поля одинаковы на обоих языках', async () => {
      const [ru, en] = await Promise.all([
        gql(`query { profile(lang: RU) { email links { url } skills { name } } }`),
        gql(`query { profile(lang: EN) { email links { url } skills { name } } }`),
      ]);
      expect(ru.body.data.profile.email).toBe(en.body.data.profile.email);
      expect(ru.body.data.profile.links).toEqual(en.body.data.profile.links);
      expect(ru.body.data.profile.skills).toEqual(en.body.data.profile.skills);
    });

    it('без аргумента lang отдаёт RU по умолчанию', async () => {
      const [def, ru] = await Promise.all([
        gql(`query { profile { name } }`),
        gql(`query { profile(lang: RU) { name } }`),
      ]);
      expect(def.body.data.profile.name).toBe(ru.body.data.profile.name);
    });

    it('counts.reviews отражает реальное число отзывов', async () => {
      const [profile, reviews] = await Promise.all([
        gql(`query { profile(lang: RU) { counts { projects reviews } } }`),
        gql(`query { reviews(lang: RU) { id } }`),
      ]);
      expect(profile.body.data.profile.counts.reviews).toBe(
        reviews.body.data.reviews.length,
      );
    });
  });

  // ------------------------------------------------------------------ опыт

  describe('experience', () => {
    it('позиции и достижения приходят на запрошенном языке', async () => {
      const q = `query ($lang: Language!) {
        profile(lang: $lang) {
          experience(lang: $lang) {
            id company position description achievements { id text order }
          }
        }
      }`;
      const [ru, en] = await Promise.all([
        gql(q, { lang: 'RU' }),
        gql(q, { lang: 'EN' }),
      ]);
      expectNoErrors(ru);
      expectNoErrors(en);

      const a = ru.body.data.profile.experience;
      const b = en.body.data.profile.experience;

      expect(a.length).toBeGreaterThan(0);
      expect(a.length).toBe(b.length);

      // компания не переводится, должность — да
      expect(a[0].company).toBe(b[0].company);
      expect(a[0].position).not.toBe(b[0].position);

      // достижения тоже локализованы и не пустые
      expect(a[0].achievements.length).toBeGreaterThan(0);
      expect(a[0].achievements[0].text).toBeTruthy();
      expect(b[0].achievements[0].text).toBeTruthy();
      expect(a[0].achievements[0].text).not.toBe(b[0].achievements[0].text);
    });

    it('достижения отсортированы по order', async () => {
      const res = await gql(
        `query { profile { experience { achievements { order } } } }`,
      );
      for (const exp of res.body.data.profile.experience) {
        const orders = exp.achievements.map((a: any) => a.order);
        expect(orders).toEqual([...orders].sort((x, y) => x - y));
      }
    });

    it('записи отсортированы по дате начала, новые первыми', async () => {
      const res = await gql(`query { profile { experience { startDate } } }`);
      const dates = res.body.data.profile.experience.map((e: any) =>
        new Date(e.startDate).getTime(),
      );
      expect(dates).toEqual([...dates].sort((a, b) => b - a));
    });
  });

  // --------------------------------------------------------------- проекты

  describe('projects', () => {
    it('названия и описания приходят на запрошенном языке', async () => {
      const q = `query ($lang: Language!) {
        profile(lang: $lang) {
          projects(lang: $lang) { id name description stack order images { url order } }
        }
      }`;
      const [ru, en] = await Promise.all([
        gql(q, { lang: 'RU' }),
        gql(q, { lang: 'EN' }),
      ]);
      expectNoErrors(ru);
      expectNoErrors(en);

      const a = ru.body.data.profile.projects;
      const b = en.body.data.profile.projects;

      expect(a.length).toBeGreaterThan(0);
      expect(a.length).toBe(b.length);
      expect(a[0].name).toBeTruthy();
      expect(b[0].name).toBeTruthy();
      expect(a[0].name).not.toBe(b[0].name);
      expect(a[0].description).not.toBe(b[0].description);

      // стек и картинки не переводятся
      expect(a[0].stack).toEqual(b[0].stack);
      expect(a[0].images).toEqual(b[0].images);
    });

    it('проекты отсортированы по order', async () => {
      const res = await gql(`query { profile { projects { order } } }`);
      const orders = res.body.data.profile.projects.map((p: any) => p.order);
      expect(orders).toEqual([...orders].sort((a, b) => a - b));
    });
  });

  // ---------------------------------------------------------------- отзывы

  describe('reviews', () => {
    it('текст и должность приходят на запрошенном языке', async () => {
      const [ru, en] = await Promise.all([
        gql(`query { reviews(lang: RU) { id authorName text position } }`),
        gql(`query { reviews(lang: EN) { id authorName text position } }`),
      ]);
      expectNoErrors(ru);
      expectNoErrors(en);

      const a = ru.body.data.reviews;
      const b = en.body.data.reviews;

      expect(a.length).toBeGreaterThan(0);
      expect(a.length).toBe(b.length);
      expect(a[0].authorName).toBe(b[0].authorName); // имя не переводится
    });

    it('фолбэк: текст не пустой даже без перевода на нужный язык', async () => {
      for (const lang of ['RU', 'EN']) {
        const res = await gql(
          `query ($lang: Language!) { reviews(lang: $lang) { id text } }`,
          { lang },
        );
        for (const r of res.body.data.reviews) {
          expect(r.text, `отзыв ${r.id} пустой на ${lang}`).toBeTruthy();
        }
      }
    });

    it('отзывы отсортированы по дате, новые первыми', async () => {
      const res = await gql(`query { reviews(lang: RU) { createdAt } }`);
      const dates = res.body.data.reviews.map((r: any) =>
        new Date(r.createdAt).getTime(),
      );
      expect(dates).toEqual([...dates].sort((a, b) => b - a));
    });

    it('битый токен не проходит валидацию', async () => {
      const res = await gql(
        `query ($t: String!) { validateReviewToken(token: $t) { isValid } }`,
        { t: 'не-uuid-вовсе' },
      );
      expectNoErrors(res);
      expect(res.body.data.validateReviewToken.isValid).toBe(false);
    });

    it('несуществующий токен не проходит валидацию', async () => {
      const res = await gql(
        `query ($t: String!) { validateReviewToken(token: $t) { isValid } }`,
        { t: '11111111-2222-3333-4444-555555555555' },
      );
      expect(res.body.data.validateReviewToken.isValid).toBe(false);
    });
  });

  // ------------------------------------------------------------- мутации

  describe('мутации и язык', () => {
    it('updateProfile пишет в тот язык, что указан в input', async () => {
      const marker = `TEST-EN-${Date.now()}`;

      const upd = await gql(
        `mutation ($input: UpdateProfileInput!) {
          updateProfile(input: $input) { name headline }
        }`,
        {
          input: {
            name: marker,
            headline: originalProfile.en.headline,
            description: originalProfile.en.description,
            location: originalProfile.en.location,
            email: originalProfile.en.email,
            language: 'EN',
          },
        },
        true,
      );
      expectNoErrors(upd);
      expect(upd.body.data.updateProfile.name).toBe(marker);

      // EN изменился
      const en = await gql(`query { profile(lang: EN) { name } }`);
      expect(en.body.data.profile.name).toBe(marker);

      // а RU остался нетронутым — главный регресс-тест
      const ru = await gql(`query { profile(lang: RU) { name } }`);
      expect(ru.body.data.profile.name).toBe(originalProfile.ru.name);
      expect(ru.body.data.profile.name).not.toBe(marker);
    });

    it('createExperience кладёт перевод в указанный язык', async () => {
      const res = await gql(
        `mutation ($input: CreateExperienceInput!) {
          createExperience(input: $input) { id company position achievements { text } }
        }`,
        {
          input: {
            company: 'E2E Corp',
            position: 'Test Engineer',
            description: 'Created by e2e test',
            startDate: '2020-01-01T00:00:00.000Z',
            achievements: ['First achievement', 'Second achievement'],
            language: 'EN',
          },
        },
        true,
      );
      expectNoErrors(res);

      const exp = res.body.data.createExperience;
      created.experienceId = exp.id;

      expect(exp.position).toBe('Test Engineer');
      expect(exp.achievements).toHaveLength(2);
      expect(exp.achievements[0].text).toBe('First achievement');

      // на EN запись есть
      const en = await gql(
        `query { profile(lang: EN) { experience(lang: EN) { id position } } }`,
      );
      const foundEn = en.body.data.profile.experience.find(
        (e: any) => e.id === exp.id,
      );
      expect(foundEn?.position).toBe('Test Engineer');

      // на RU запись есть, но перевода нет — position пустой
      const ru = await gql(
        `query { profile(lang: RU) { experience(lang: RU) { id position } } }`,
      );
      const foundRu = ru.body.data.profile.experience.find(
        (e: any) => e.id === exp.id,
      );
      expect(foundRu).toBeDefined();
      expect(foundRu.position).toBe('');
    });

    it('updateExperience добавляет второй перевод, не трогая первый', async () => {
      const res = await gql(
        `mutation ($input: UpdateExperienceInput!) {
          updateExperience(input: $input) { id position }
        }`,
        {
          input: {
            id: created.experienceId,
            company: 'E2E Corp',
            position: 'Тестировщик',
            startDate: '2020-01-01T00:00:00.000Z',
            achievements: ['Первое достижение', 'Второе достижение'],
            language: 'RU',
          },
        },
        true,
      );
      expectNoErrors(res);
      expect(res.body.data.updateExperience.position).toBe('Тестировщик');

      const q = `query ($lang: Language!) {
        profile(lang: $lang) { experience(lang: $lang) { id position achievements { text } } }
      }`;
      const [ru, en] = await Promise.all([
        gql(q, { lang: 'RU' }),
        gql(q, { lang: 'EN' }),
      ]);

      const findIt = (r: any) =>
        r.body.data.profile.experience.find(
          (e: any) => e.id === created.experienceId,
        );

      expect(findIt(ru).position).toBe('Тестировщик');
      expect(findIt(en).position).toBe('Test Engineer'); // английский не затёрся
    });

    it('createProject кладёт перевод в указанный язык', async () => {
      const res = await gql(
        `mutation ($input: CreateProjectInput!) {
          createProject(input: $input) { id name description }
        }`,
        {
          input: {
            name: 'E2E Project',
            description: 'Created by e2e test',
            stack: ['TypeScript'],
            order: 999,
            language: 'EN',
          },
        },
        true,
      );
      expectNoErrors(res);

      const project = res.body.data.createProject;
      created.projectId = project.id;
      expect(project.name).toBe('E2E Project');

      const ru = await gql(
        `query { profile(lang: RU) { projects(lang: RU) { id name } } }`,
      );
      const foundRu = ru.body.data.profile.projects.find(
        (p: any) => p.id === project.id,
      );
      expect(foundRu).toBeDefined();
      expect(foundRu.name).toBe(''); // русского перевода ещё нет
    });

    it('updateProject добавляет второй перевод, не трогая первый', async () => {
      const res = await gql(
        `mutation ($input: UpdateProjectInput!) {
          updateProject(input: $input) { id name }
        }`,
        {
          input: {
            id: created.projectId,
            name: 'Тестовый проект',
            description: 'Создан автотестом',
            stack: ['TypeScript'],
            order: 999,
            language: 'RU',
          },
        },
        true,
      );
      expectNoErrors(res);
      expect(res.body.data.updateProject.name).toBe('Тестовый проект');

      const q = `query ($lang: Language!) {
        profile(lang: $lang) { projects(lang: $lang) { id name } }
      }`;
      const [ru, en] = await Promise.all([
        gql(q, { lang: 'RU' }),
        gql(q, { lang: 'EN' }),
      ]);

      const findIt = (r: any) =>
        r.body.data.profile.projects.find((p: any) => p.id === created.projectId);

      expect(findIt(ru).name).toBe('Тестовый проект');
      expect(findIt(en).name).toBe('E2E Project'); // английский на месте
    });

    it('отзыв по токену сохраняет текст', async () => {
      // выдаём токен
      const tokenRes = await gql(
        `mutation ($input: CreateReviewTokenInput!) {
          createReviewToken(input: $input) { id type isUsed }
        }`,
        { input: { type: 'EMPLOYER', days: 1 } },
        true,
      );
      expectNoErrors(tokenRes);
      const token = tokenRes.body.data.createReviewToken;
      created.tokenId = token.id;
      expect(token.isUsed).toBe(false);

      // токен валиден
      const check = await gql(
        `query ($t: String!) { validateReviewToken(token: $t) { isValid type } }`,
        { t: token.id },
      );
      expect(check.body.data.validateReviewToken.isValid).toBe(true);

      // оставляем отзыв
      const submit = await gql(
        `mutation ($input: CreateReviewInput!) {
          submitReview(input: $input) { id authorName text position rating }
        }`,
        {
          input: {
            token: token.id,
            authorName: 'E2E Reviewer',
            company: 'E2E Corp',
            position: 'CTO',
            text: 'Текст отзыва из автотеста',
            rating: 5,
            language: 'RU',
          },
        },
      );
      expectNoErrors(submit);

      const review = submit.body.data.submitReview;
      created.reviewId = review.id;

      // текст не потерялся — тот самый баг
      expect(review.text).toBe('Текст отзыва из автотеста');
      expect(review.position).toBe('CTO');

      // и виден в списке
      const list = await gql(`query { reviews(lang: RU) { id text } }`);
      const found = list.body.data.reviews.find((r: any) => r.id === review.id);
      expect(found?.text).toBe('Текст отзыва из автотеста');

      // фолбэк: на EN перевода нет, но текст показывается
      const listEn = await gql(`query { reviews(lang: EN) { id text } }`);
      const foundEn = listEn.body.data.reviews.find(
        (r: any) => r.id === review.id,
      );
      expect(foundEn?.text).toBeTruthy();

      // токен сгорел
      const recheck = await gql(
        `query ($t: String!) { validateReviewToken(token: $t) { isValid } }`,
        { t: token.id },
      );
      expect(recheck.body.data.validateReviewToken.isValid).toBe(false);
      created.tokenId = ''; // уже использован, отзывать нечего
    });

    it('повторное использование токена отклоняется', async () => {
      const tokenRes = await gql(
        `mutation ($input: CreateReviewTokenInput!) {
          createReviewToken(input: $input) { id }
        }`,
        { input: { type: 'EMPLOYER', days: 1 } },
        true,
      );
      const tokenId = tokenRes.body.data.createReviewToken.id;

      const input = {
        token: tokenId,
        authorName: 'Double Submit',
        text: 'Первый раз',
        language: 'RU',
      };

      const first = await gql(
        `mutation ($input: CreateReviewInput!) { submitReview(input: $input) { id } }`,
        { input },
      );
      expectNoErrors(first);
      const firstId = first.body.data.submitReview.id;

      const second = await gql(
        `mutation ($input: CreateReviewInput!) { submitReview(input: $input) { id } }`,
        { input: { ...input, text: 'Второй раз' } },
      );
      expect(second.body.errors).toBeDefined();

      // убираем за собой
      await gql(
        `mutation ($id: ID!) { deleteReview(id: $id) }`,
        { id: firstId },
        true,
      );
    });

    it('токен заказчика без проекта отклоняется', async () => {
      const res = await gql(
        `mutation ($input: CreateReviewTokenInput!) {
          createReviewToken(input: $input) { id }
        }`,
        { input: { type: 'CLIENT', days: 1 } },
        true,
      );
      expect(res.body.errors).toBeDefined();
    });
  });

  // -------------------------------------------------------------- валидация

  describe('валидация и доступ', () => {
    it('невалидный email отклоняется', async () => {
      const res = await gql(
        `mutation ($input: UpdateProfileInput!) {
          updateProfile(input: $input) { id }
        }`,
        { input: { email: 'не-почта' } },
        true,
      );
      expect(res.body.errors).toBeDefined();
    });

    it('неизвестное значение языка отклоняется схемой', async () => {
      const res = await gql(`query { profile(lang: DE) { name } }`);
      expect(res.body.errors).toBeDefined();
    });

    it('мутации закрыты без токена админа', async () => {
      const res = await gql(
        `mutation ($input: CreateProjectInput!) {
          createProject(input: $input) { id }
        }`,
        {
          input: {
            name: 'Should not exist',
            description: 'no auth',
            stack: [],
            language: 'RU',
          },
        },
        // без auth
      );
      expect(res.body.errors).toBeDefined();
    });

    it('несуществующий id даёт понятную ошибку, а не падение', async () => {
      const res = await gql(
        `mutation ($input: UpdateExperienceInput!) {
          updateExperience(input: $input) { id }
        }`,
        {
          input: {
            id: '11111111-2222-3333-4444-555555555555',
            position: 'Ghost',
            language: 'RU',
          },
        },
        true,
      );
      expect(res.body.errors).toBeDefined();
      expect(res.status).toBe(200); // GraphQL отвечает 200 с errors
    });
  });
});
