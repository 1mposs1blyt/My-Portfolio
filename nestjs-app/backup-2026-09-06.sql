--
-- PostgreSQL database dump
--

\restrict hFyOPaKARvxPMNfEu9j3daU8LP6vRMxNdghie4VRJxMhvZkHCQZv7Y43EMwcTl0

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: LinkKind; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LinkKind" AS ENUM (
    'GITHUB',
    'LINKEDIN',
    'TELEGRAM',
    'EMAIL',
    'WEBSITE'
);


ALTER TYPE public."LinkKind" OWNER TO postgres;

--
-- Name: ReviewType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ReviewType" AS ENUM (
    'CLIENT',
    'EMPLOYER'
);


ALTER TYPE public."ReviewType" OWNER TO postgres;

--
-- Name: SkillCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SkillCategory" AS ENUM (
    'LANGUAGE',
    'BACKEND',
    'FRONTEND',
    'DATABASE',
    'INFRA',
    'TOOL'
);


ALTER TYPE public."SkillCategory" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profile" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    headline text NOT NULL,
    description text NOT NULL,
    location text,
    email text NOT NULL
);


ALTER TABLE public."Profile" OWNER TO postgres;

--
-- Name: ProfileLink; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProfileLink" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "profileId" uuid NOT NULL,
    kind public."LinkKind" NOT NULL,
    label text NOT NULL,
    url text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."ProfileLink" OWNER TO postgres;

--
-- Name: Project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Project" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "profileId" uuid NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    "repoUrl" text,
    "liveUrl" text,
    stack text[],
    "order" integer DEFAULT 0 NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Project" OWNER TO postgres;

--
-- Name: Review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Review" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public."ReviewType" NOT NULL,
    "authorName" text NOT NULL,
    company text,
    "position" text,
    "avatarUrl" text,
    text text NOT NULL,
    rating integer,
    "projectId" uuid,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Review" OWNER TO postgres;

--
-- Name: ReviewToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReviewToken" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public."ReviewType" NOT NULL,
    "projectId" uuid,
    "isUsed" boolean DEFAULT false NOT NULL,
    "expiresAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ReviewToken" OWNER TO postgres;

--
-- Name: Skill; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Skill" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "profileId" uuid NOT NULL,
    name text NOT NULL,
    category public."SkillCategory" NOT NULL,
    level integer DEFAULT 3 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."Skill" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "experienceId" uuid NOT NULL,
    text text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: experiences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.experiences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "profileId" uuid NOT NULL,
    company text NOT NULL,
    "position" text NOT NULL,
    description text,
    "startDate" date NOT NULL,
    "endDate" date
);


ALTER TABLE public.experiences OWNER TO postgres;

--
-- Name: project_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "projectId" uuid NOT NULL,
    url text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.project_images OWNER TO postgres;

--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profile" (id, name, headline, description, location, email) FROM stdin;
00000000-0000-0000-0000-000000000001	Александр Брягиня	Full-stack разработчик	Разработка бэкенд и кроссплатформенных приложений (NestJS, PostgreSQL, Prisma, GraphQL)	Новосибирск, Россия	alexander@example.com
\.


--
-- Data for Name: ProfileLink; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProfileLink" (id, "profileId", kind, label, url, "order") FROM stdin;
a133689f-f609-4ac8-9271-ebc78ee7d453	00000000-0000-0000-0000-000000000001	GITHUB	GitHub	https://github.com/1mposs1blyt	1
662bfadf-bec8-4462-b936-7c18f10a6bf7	00000000-0000-0000-0000-000000000001	TELEGRAM	Telegram	https://t.me/alexandr_st54_nsk	2
8537b4ca-64e1-43c9-9e28-2e903f127d97	00000000-0000-0000-0000-000000000001	TELEGRAM	@username	https://t.me/username	1
\.


--
-- Data for Name: Project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Project" (id, "profileId", name, description, "repoUrl", "liveUrl", stack, "order", "updatedAt") FROM stdin;
d2e095d7-6856-492d-8b74-39b10185abd8	00000000-0000-0000-0000-000000000001	SaveurBooking	Сервис бронирования ресторанов	https://github.com/1mposs1blyt/saveur-booking-task	https://saveur-booking-task.vercel.app/	{Next.js,"React Hook Form",Zod,Prisma}	1	2026-09-06 02:03:18.641
49359b88-cbc7-4a76-90b9-76313e555482	00000000-0000-0000-0000-000000000001	Мой супер пет-проект №2	Написан на NestJS и GraphQL	https://saveur-booking-task.vercel.app/	\N	{NestJS,GraphQL,Prisma}	1	2026-09-06 02:03:18.641
ac560b3f-3498-487c-97e0-71841d2efb7b	00000000-0000-0000-0000-000000000001	Moto-voice-chat	Приложение для мотоциклов (на данный момент в разработке)	https://github.com/1mposs1blyt/moto-voice-chat	\N	{"React Native",Express,WebSocket}	2	2026-09-06 02:03:18.641
3d3bd762-c9f9-412f-a313-320a6e56ac58	00000000-0000-0000-0000-000000000001	5	5	\N	\N	\N	5	2026-09-06 02:03:18.641
95a33ef5-f5e1-4544-9284-0b5a86356be8	00000000-0000-0000-0000-000000000001	Проверка	4	\N	\N	{vibecode}	4	2026-09-05 19:03:23.398
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Review" (id, type, "authorName", company, "position", "avatarUrl", text, rating, "projectId", "createdAt") FROM stdin;
cfeedfb9-6b2d-4689-bb2d-85ce20e0da4f	CLIENT	Тестовый Заказчик	Кастом Лабс	Product Owner	\N	Отзыв успешно отправлен через GraphQL! Бэкенд NestJS проверил секретный токен, сохранил этот текст в PostgreSQL и заблокировал ссылку для повторного использования.	5	d2e095d7-6856-492d-8b74-39b10185abd8	2026-09-05 12:29:32.414
092e25f8-6205-4462-b782-d6bb0cbf6847	EMPLOYER	Дмитрий Козлов	Resto Tech	CTO / Технический директор	\N	Александр — сильный full-stack инженер с отличным пониманием TypeScript и экосистемы Node.js. Самостоятельно спроектировал и реализовал интеграционные модули для ККТ АТОЛ по сети, закрыв сложную бизнес-задачу. Проявляет инициативу, пишет понятный поддерживаемый код. Рекомендую в команду.	5	\N	2026-09-05 12:36:35.773
24ee9967-fc44-4c84-a7f7-3ebbddc6a005	EMPLOYER	Alexandr Bryaginya	Softtrade	Software developer	\N	lorem ipsum dolore....	5	\N	2026-09-05 12:56:54.995
8999f7bb-9434-4eb6-9767-975e63a0d335	CLIENT	alex b	einstein	\N	\N	отзыв на заказ	5	\N	2026-09-05 13:01:10.79
\.


--
-- Data for Name: ReviewToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ReviewToken" (id, type, "projectId", "isUsed", "expiresAt", "createAt") FROM stdin;
fea3b186-fce8-4961-9fa7-a6cfd6b5caf4	EMPLOYER	\N	f	2026-09-05 19:30:51.534	2026-09-05 19:30:51.534
403d0d0c-c7fa-4011-9448-b9305fdf1822	CLIENT	ac560b3f-3498-487c-97e0-71841d2efb7b	t	2026-09-05 19:28:51.008	2026-09-05 19:28:51.008
0dea82b5-bb51-4de4-91a3-c341d01407a7	EMPLOYER	\N	t	2026-09-05 19:32:16.517	2026-09-05 19:32:16.517
9acc8b7e-5818-420b-8e91-a30e1ae1cd53	EMPLOYER	\N	t	2026-09-05 19:54:39.303	2026-09-05 19:54:39.303
7a03f5fc-ad57-42b3-aab4-b8fe35e605b4	CLIENT	\N	t	2026-09-05 19:59:46.081	2026-09-05 19:59:46.081
\.


--
-- Data for Name: Skill; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Skill" (id, "profileId", name, category, level, "order") FROM stdin;
1776ee86-2873-4ac6-9a90-39efc6861e29	00000000-0000-0000-0000-000000000001	TypeScript	LANGUAGE	5	1
8273e5f0-1c35-4c50-9bca-6ae298c17e51	00000000-0000-0000-0000-000000000001	Prisma	DATABASE	5	3
e34806fc-5f47-43c4-b46f-2dd08f2e7ed4	00000000-0000-0000-0000-000000000001	GraphQL	BACKEND	4	4
ad7d3603-5946-4749-ab63-3d698d1de86f	00000000-0000-0000-0000-000000000001	Docker	INFRA	4	5
880c4305-efd3-4fbb-a585-4c839a48f908	00000000-0000-0000-0000-000000000001	JavaScript	LANGUAGE	5	2
43dc8808-e54e-462a-8236-33ca22e898f4	00000000-0000-0000-0000-000000000001	NestJS	BACKEND	5	6
d8d69bb4-772e-4abb-939a-54ebab1ef126	00000000-0000-0000-0000-000000000001	Python	LANGUAGE	3	3
ca743616-a21f-4f0c-ba2e-8547eb36b932	00000000-0000-0000-0000-000000000001	PHP	LANGUAGE	2	4
c73a5c73-9892-4abc-a4cd-1fd3fb334037	00000000-0000-0000-0000-000000000001	C#	LANGUAGE	1	5
41a923d8-dd38-416e-b1f7-7a87404c6ab3	00000000-0000-0000-0000-000000000001	C++	LANGUAGE	0	6
4e4e9200-7e91-4c67-a9a0-4e28932ae37f	00000000-0000-0000-0000-000000000001	Redis	DATABASE	5	0
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
27001827-759b-453c-ba8b-e76327d73026	2c1512deb59b42db07bd601bd39dd369fbc9d10b3a051af7f024487346399fdc	2026-09-03 11:24:16.707693+07	20260903042416_init	\N	\N	2026-09-03 11:24:16.681098+07	1
1c400709-4bd9-4aff-9ad9-df01e49db19a	0584a4e43f73f587ffe96c8794c1ace9424cf64d4126e9707610f4b24e35ba11	2026-09-04 17:10:34.090907+07	20260904101034_add_project_images	\N	\N	2026-09-04 17:10:34.087946+07	1
d9c04e42-604a-4fb1-a800-237dadf5708a	76b2cbefbeb7e806305afa1a86429c254a488ac3ba1b6746e49bf88f6384f24e	2026-09-04 17:17:44.787195+07	20260904101744_add_project_images_2	\N	\N	2026-09-04 17:17:44.784263+07	1
f697fcd8-b5b1-44f0-be2a-35e756d3830e	4342ed600c475a620b1318729be9b9ba67a4bab572b65e211ca0a0b31ff8b6d7	2026-09-05 18:44:57.658094+07	20260905114457_reviews_review_token	\N	\N	2026-09-05 18:44:57.65047+07	1
e8a9959e-cd98-4159-ad8d-98e4269fcac3	02851180f6527abd5f7d1070f1f510de8106c05cb57369c362064cc23808837e	2026-09-05 19:36:20.801338+07	20260905123620_fix_review_project_id_type	\N	\N	2026-09-05 19:36:20.795175+07	1
2d795c10-2431-4bb1-9651-88b1c84f6c3a	76d85fff73bddd005cfc9d635a5d6a5ca24d9ee22ba500f4e4b8493b4c5b5701	2026-09-06 02:03:18.64353+07	20260905190318_add_project_updated_at	\N	\N	2026-09-06 02:03:18.639766+07	1
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.achievements (id, "experienceId", text, "order") FROM stdin;
d7615d4a-b653-4904-99b3-2375eae2be2f	6723e221-9db6-4e33-991a-582d869cd996	Разработал сервисы учета и интеграции с фискальными регистраторами	1
a4281f11-d6c2-45c6-b8cc-461d99455088	6723e221-9db6-4e33-991a-582d869cd996	Спроектировал GraphQL API для цифровых систем управления	2
a58e9462-7a23-4c9a-b5b3-cb1cdc87ab4b	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	1
9e86d08d-83c9-4f86-9348-02377067d64e	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	3
c906f726-fcbc-480e-9c8e-8f8921e8c2df	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	2
8d5cd546-0dea-4973-8e9c-033d940ce053	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	8
fc71a827-1a98-453d-8316-85de148830ec	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	7
b2427f2d-1f92-473b-8e5f-7b50a900caed	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	6
4707bb63-320d-4138-9ad8-d71c29063e2e	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	5
cb3a6c49-8275-4f48-8370-52ef962dbabd	1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	Какое то крутое достижение потом напишу	4
b5391275-a5cb-4b98-bff9-41bbd51f497a	dbe375a4-d042-423f-9bd3-f0e54322e474	Первое	0
edeea217-4077-4e07-8054-315e6e6339e8	dbe375a4-d042-423f-9bd3-f0e54322e474	Второе	1
4a49511a-7f95-4ca0-a88f-60c3d6eac58f	dbe375a4-d042-423f-9bd3-f0e54322e474	Третье	2
\.


--
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.experiences (id, "profileId", company, "position", description, "startDate", "endDate") FROM stdin;
6723e221-9db6-4e33-991a-582d869cd996	00000000-0000-0000-0000-000000000001	SoftTrade / Freelance	Full-Stack Developer	Разработка веб и мобильных сервисов	2024-01-01	\N
1901de14-efa7-4f97-bdeb-5e3dc2ce28ca	00000000-0000-0000-0000-000000000001	SoftTrade / ООО Трейд Плюс	Инженер программист - основное подразделение	Разработка веб и мобильных сервисов	2026-08-19	\N
dbe375a4-d042-423f-9bd3-f0e54322e474	00000000-0000-0000-0000-000000000001	RestoPOS	Full-stack разработчик	\N	2026-03-01	\N
\.


--
-- Data for Name: project_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_images (id, "projectId", url, "order") FROM stdin;
de0e67d0-c8b4-493a-a7bc-b01e7be2289a	ac560b3f-3498-487c-97e0-71841d2efb7b	https://placehold.net/4-800x600.png	1
d0d3b9ec-44eb-4a4d-92d9-4384f2c3d235	ac560b3f-3498-487c-97e0-71841d2efb7b	https://placehold.net/6-800x600.png	2
58fd9558-4b76-42d7-a308-dae846ccc6e0	ac560b3f-3498-487c-97e0-71841d2efb7b	https://placehold.net/10-800x600.png	3
a2d4bc94-944d-455b-9bcd-958841b14362	49359b88-cbc7-4a76-90b9-76313e555482	https://placehold.net/5-800x600.png	1
cfab7ed2-651e-4732-8196-af2bdeddfe3b	d2e095d7-6856-492d-8b74-39b10185abd8	/public/saveur.png	1
e4da9d40-b924-4da4-babd-6d84f841b87e	d2e095d7-6856-492d-8b74-39b10185abd8	/public/saveur2.png	2
91ced86c-3a93-4442-8c1c-defe13fab134	d2e095d7-6856-492d-8b74-39b10185abd8	/public/saveur3.png	3
\.


--
-- Name: ProfileLink ProfileLink_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileLink"
    ADD CONSTRAINT "ProfileLink_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: ReviewToken ReviewToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReviewToken"
    ADD CONSTRAINT "ReviewToken_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Skill Skill_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- Name: project_images project_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT project_images_pkey PRIMARY KEY (id);


--
-- Name: ProfileLink_profileId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ProfileLink_profileId_idx" ON public."ProfileLink" USING btree ("profileId");


--
-- Name: Profile_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Profile_email_key" ON public."Profile" USING btree (email);


--
-- Name: Project_profileId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Project_profileId_idx" ON public."Project" USING btree ("profileId");


--
-- Name: Project_profileId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Project_profileId_name_key" ON public."Project" USING btree ("profileId", name);


--
-- Name: Skill_profileId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Skill_profileId_idx" ON public."Skill" USING btree ("profileId");


--
-- Name: Skill_profileId_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Skill_profileId_name_key" ON public."Skill" USING btree ("profileId", name);


--
-- Name: achievements_experienceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "achievements_experienceId_idx" ON public.achievements USING btree ("experienceId");


--
-- Name: experiences_profileId_startDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "experiences_profileId_startDate_idx" ON public.experiences USING btree ("profileId", "startDate");


--
-- Name: project_images_projectId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "project_images_projectId_idx" ON public.project_images USING btree ("projectId");


--
-- Name: ProfileLink ProfileLink_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProfileLink"
    ADD CONSTRAINT "ProfileLink_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Project Project_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewToken ReviewToken_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReviewToken"
    ADD CONSTRAINT "ReviewToken_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Review Review_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Skill Skill_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Skill"
    ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: achievements achievements_experienceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT "achievements_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES public.experiences(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: experiences experiences_profileId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT "experiences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES public."Profile"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_images project_images_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_images
    ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict hFyOPaKARvxPMNfEu9j3daU8LP6vRMxNdghie4VRJxMhvZkHCQZv7Y43EMwcTl0

