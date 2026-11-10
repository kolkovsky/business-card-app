# Цифровая визитка — GraphQL backend

Профиль разработчика (ссылки, навыки, опыт, проекты) через GraphQL API и Apollo Sandbox.

**Стек:** TypeScript · Node.js 22 · NestJS 11 · Apollo Server 5 · Prisma 6 · PostgreSQL 16 · Docker

| | |
|---|---|
| Деплой (Apollo Sandbox) | `https://<your-app>.fly.dev/graphql` <!-- TODO: подставить ссылку после деплоя --> |
| Репозиторий | `https://github.com/<your-github>/it-solutions-assignment` <!-- TODO --> |

## Запуск

### Docker: одна команда

Нужен только Docker. База, миграции, seed и сервер запускаются автоматически.

```bash
docker compose up --build
```

Sandbox откроется на http://localhost:3000/graphql. Начать с чистой БД: `docker compose down -v`, затем команда выше.

### Пошагово: для разработки

Нужны Docker и Node.js 22+.

**1. Создать файл окружения**

```bash
cp .env.example .env
```

**2. Установить зависимости**

```bash
npm ci
```

**3. Запустить базу данных**

```bash
docker compose up -d postgres
```

**4. Применить миграции**

```bash
npm run db:deploy
```

**5. Заполнить базу данными из seed**

```bash
npm run db:seed
```

**6. Запустить сервер**

```bash
npm run start:dev
```

**7. Открыть Sandbox** на http://localhost:3000/graphql и выполнить запрос:

```graphql
query {
  profile {
    name
    headline
    description
    links { label url }
    skills { name category }
    experience { company position startDate endDate isCurrent achievements { text } }
    projects { name url }
  }
}
```

Полная схема API: [`schema.gql`](./schema.gql).

## Команды

| Команда | Назначение |
|---|---|
| `npm run lint` | ESLint и Prettier |
| `npm test` | unit-тесты |
| `npm run test:e2e` | e2e-тесты, нужна запущенная база (шаг 3); используют отдельную БД `business_card_test` |
| `npm run db:migrate` | создать новую миграцию |
| `npm run build` | сборка в `dist/` |

## Переменные окружения

Проверяются при старте: при ошибке приложение сразу завершается.

| Переменная | По умолчанию | Описание |
|---|---|---|
| `DATABASE_URL` | обязательная | строка подключения PostgreSQL |
| `PORT` | `3000` | HTTP-порт |
| `NODE_ENV` | `development` | `development` / `production` / `test` |
| `GRAPHQL_MAX_DEPTH` | `6` | максимальная глубина запроса |
| `LOG_SQL` | `false` | логировать SQL-запросы Prisma |
| `SEED_ON_START` | `true` | запускать seed при старте контейнера |
| `TRUST_PROXY_HOPS` | `0` | сколько reverse proxy стоит перед приложением; значение больше реального позволит подделать IP в логах через `X-Forwarded-For` |

## Архитектура

| Слой | Отвечает за |
|---|---|
| **Resolver** | GraphQL: аргументы, поля, выбор DataLoader'а |
| **Service** | бизнес-правила и группировка батчей по ключам |
| **Repository** | запросы к БД через Prisma |

Каждая сущность лежит в своей папке в `src/` (`profile`, `links`, `skills`, `experience`, `projects`). Инфраструктура вынесена отдельно: `config`, `prisma`, `graphql`, `dataloader`, `health`.

## Обоснование решений

- **Code-first GraphQL.** Типы описаны TypeScript-классами, поэтому схема и резолверы не расходятся. Сгенерированный `schema.gql` закоммичен как контракт API.
- **DataLoader вместо `include`.** Каждая связь резолвится отдельным `@ResolveField`, поэтому в БД уходит только то, что запросил клиент. Полный запрос профиля всегда занимает 6 SQL-запросов, сколько бы ни было записей. Это закреплено e2e-тестом, вручную можно проверить через `LOG_SQL=true docker compose up`.
- **Loader'ы создаются в GraphQL-контексте, а не через `Scope.REQUEST`.** Кэш изолирован между запросами, а резолверы и сервисы остаются синглтонами и не пересоздаются на каждый запрос.
- **Модель данных.** Все связи один-ко-многим с `ON DELETE CASCADE`. Составные уникальные ключи (`[profileId, name]` и другие) служат ключом для `upsert` в seed и индексом для батч-запросов. Даты работы хранятся как `DATE`, `endDate = null` означает текущее место.
- **Seed как синхронизация.** Данные лежат в [`prisma/seed-data.ts`](./prisma/seed-data.ts), логика в `seed.ts`. В одной транзакции seed делает `upsert` и удаляет записи, которых больше нет в данных, поэтому его безопасно запускать на каждом старте.
- **Docker.** Multi-stage сборка, запуск не от root, `tini` как PID 1 для корректного завершения, `HEALTHCHECK` на `/health` с проверкой БД. Entrypoint повторяет `migrate deploy`, пока база недоступна.
- **Логи и защита.** Лимит глубины отклоняет запросы до обращения к БД. Каждый HTTP-запрос, кроме `/health`, логируется с IP клиента.
- **Версии.** NestJS 11 вместо ESM-only 12 и Prisma 6 вместо 7: меньше сложностей с инструментами без потери пользы для задачи.

## Деплой

Приложение развёрнуто на Fly.io, настройки лежат в [`fly.toml`](./fly.toml). Нужен установленный и авторизованный `flyctl`.

**1. Создать приложение**

```bash
fly apps create user-business-card
```

**2. Создать базу данных**

```bash
fly postgres create --name user-business-card-db --region ams --vm-size shared-cpu-1x --volume-size 1 --initial-cluster-size 1
```

**3. Подключить базу к приложению** (команда сама задаст секрет `DATABASE_URL`)

```bash
fly postgres attach user-business-card-db --app user-business-card
```

**4. Задеплоить**

```bash
fly deploy
```

Миграции и seed выполняются при старте контейнера. На другой платформе с Docker достаточно передать `DATABASE_URL`.

## Ограничения

- Образ большой: Prisma CLI нужен в рантайме только для `migrate deploy`. Миграции можно вынести в отдельный job.
- Нет мутаций и аутентификации: данные редактируются через `seed-data.ts`.
- Глубина запроса ограничена, сложность нет. Для публичного API со списками нужны query complexity и пагинация.
