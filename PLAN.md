# План поэтапной реализации

Требования: [ASSIGNMENT.md](./ASSIGNMENT.md).

## Ключевые архитектурные решения

| Решение | Выбор | Обоснование |
|---|---|---|
| GraphQL | code-first (`@nestjs/graphql` + Apollo Driver) | Типы TS являются единым источником правды, схема генерируется автоматически |
| СУБД | PostgreSQL 16 | Требование стека, хорошо поддерживается Prisma |
| ORM | Prisma | Требование. Миграции версионируются в репозитории |
| N+1 | `@ResolveField` + DataLoader (request-scoped) | Вложенные поля грузятся пакетно: 1 запрос на каждую связь, а не на каждую запись |
| Слои | Resolver → Service → Repository (PrismaService) | Resolver отвечает только за GraphQL, Service за бизнес-логику, Repository за доступ к данным |
| Инициализация БД | `prisma migrate deploy` + идемпотентный seed (upsert) при старте контейнера | Запуск с нуля одной командой, повторный запуск не плодит дубли |
| Конфигурация | `@nestjs/config` + валидация env (Joi или zod) | Приложение падает сразу при неверной конфигурации |
| Запуск | multi-stage Dockerfile + `docker-compose.yml` (app + postgres + healthcheck) | Воспроизводимость |

## Модель данных (черновик)

- `Profile`: id, name, description, title, email?
- `Link`: id, profileId, label, url
- `Skill`: id, profileId, name, category?, level?, order
- `Experience`: id, profileId, company, position, startDate, endDate?, order
- `Achievement`: id, experienceId, text, order
- `Project`: id, profileId, name, description?, url, order

Все связи один-ко-многим к `Profile`. Для списков есть индексы по `profileId`.

## Структура проекта

```
src/
  main.ts
  app.module.ts
  config/              # загрузка и валидация env
  prisma/              # PrismaModule, PrismaService
  profile/             # resolver, service, repository, модели, dataloaders
  skills/
  experience/
  projects/
  common/              # общие утилиты, DataLoader-хелперы
prisma/
  schema.prisma
  migrations/
  seed.ts
  seed-data.ts         # реальные данные автора, отдельно от логики
Dockerfile
docker-compose.yml
docker-entrypoint.sh
```

## Этапы

### Этап 0. Подготовка репозитория
- [x] `.gitignore`, `.editorconfig`, `.nvmrc`
- [x] Инициализация git-истории, осмысленные коммиты по этапам (Conventional Commits)
- [x] Выбор менеджера пакетов (pnpm или npm) и фиксация версии Node (LTS)

**Готово, когда:** репозиторий чистый, правила оформления коммитов определены.

### Этап 1. Каркас NestJS
- [x] `nest new` на TypeScript со strict-режимом
- [x] ESLint + Prettier
- [x] `@nestjs/config` с валидацией env (`DATABASE_URL`, `PORT`, `NODE_ENV`)
- [x] Health-эндпоинт `/health`

**Готово, когда:** `npm run start:dev` поднимает приложение, lint проходит.

### Этап 2. PostgreSQL и Prisma
- [x] `schema.prisma` по модели выше, индексы, `onDelete: Cascade`
- [x] Первая миграция
- [x] `PrismaModule` / `PrismaService` (подключение, `onModuleInit`, graceful shutdown)
- [x] Локальный Postgres через `docker-compose` (пока только БД)

**Готово, когда:** `prisma migrate dev` создаёт схему, `PrismaService` подключается.

### Этап 3. Seed
- [x] `seed-data.ts` с реальными данными: профиль, ссылки, навыки, опыт с достижениями, проекты
- [x] `seed.ts` на `upsert` и транзакции, повторный запуск безопасен
- [x] Настройка `prisma.seed` в `package.json`

**Готово, когда:** `prisma db seed` дважды подряд даёт одинаковое состояние БД без дублей.

### Этап 4. GraphQL API
- [x] `GraphQLModule` (Apollo Driver, code-first, автогенерация схемы)
- [x] Включить Apollo Sandbox (landing page) в том числе в production-сборке
- [x] Типы `@ObjectType`: Profile, Link, Skill, Experience, Achievement, Project
- [x] `ProfileResolver.profile` + слои Service и Repository
- [x] `@ResolveField` для `links`, `skills`, `experience`, `projects`, `achievements`

**Готово, когда:** пример запроса из задания возвращает данные в Sandbox.

### Этап 5. Оптимизация вложенных запросов
- [x] Request-scoped DataLoader для каждой связи (`skillsByProfileId`, `experienceByProfileId` и т. д.)
- [x] Пакетная загрузка `achievements` по `experienceId`
- [x] Включить логирование Prisma-запросов и проверить число SQL на запрос
- [x] Ограничение глубины и сложности запроса (`depth limit`), чтобы защитить API

**Готово, когда:** полный запрос профиля выполняется фиксированным числом SQL-запросов, не зависящим от количества записей. Это зафиксировано в тесте.

### Этап 6. Docker и запуск с нуля
- [x] Multi-stage `Dockerfile` (deps → build → runtime, non-root, минимальный образ)
- [x] `docker-entrypoint.sh`: ожидание БД → `prisma migrate deploy` → seed → старт приложения
- [x] `docker-compose.yml`: `app` + `postgres` с healthcheck и `depends_on: service_healthy`
- [x] `.dockerignore`

**Готово, когда:** на чистой машине `docker compose up --build` поднимает всё, Sandbox открывается на `http://localhost:3000/graphql`.

### Этап 7. Тесты
- [x] Unit-тесты сервисов (мок репозиториев)
- [x] e2e: запрос профиля с вложенными полями против тестовой БД
- [x] Тест на отсутствие N+1 (подсчёт SQL-запросов)
- [x] Скрипт `npm test` и `npm run test:e2e`

**Готово, когда:** тесты проходят локально и в CI.

### Этап 8. CI (опционально, плюс)
- [x] GitHub Actions: install → lint → build → test → сборка Docker-образа

### Этап 9. Деплой
- [ ] Выбрать платформу (Railway или Render: удобны для Docker + управляемый Postgres)
- [ ] Переменные окружения, `DATABASE_URL`
- [ ] Проверить, что Sandbox доступен по публичной ссылке

**Готово, когда:** есть публичный URL, пример запроса работает.

### Этап 10. README.md и финальная проверка
- [x] Описание проекта и быстрый старт (`docker compose up`)
- [x] Схема архитектуры и слоёв
- [x] **Обоснование решений** (требование задания): code-first, DataLoader, слои, seed, Docker
- [x] Модель данных и примеры запросов
- [x] Ограничения и возможные улучшения
- [x] Проверка с нуля: клонировать репозиторий в чистую папку и запустить по README
- [ ] Отправить: ссылку на деплой и ссылку на Git

## Подготовка к собеседованию

На собеседовании придётся вносить изменения в код на демонстрации экрана. Заранее потренироваться:
- добавить новое поле или сущность (миграция → модель → resolver → seed);
- добавить фильтр или аргумент к запросу;
- объяснить, где и почему работает DataLoader.

## Порядок и оценка

Этапы 0–6 дают рабочее решение, это ядро. Этапы 7–10 повышают качество и обязательны для итоговой отправки. Этап 8 можно пропустить.
