import { INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { seedProfile } from '../prisma/seed';
import { profileSeed } from '../prisma/seed-data';
import { AppModule } from '../src/app.module';
import { AppConfigService } from '../src/config/app-config.service';
import { PrismaService } from '../src/prisma/prisma.service';

const FULL_PROFILE_QUERY = /* GraphQL */ `
  query {
    profile {
      name
      description
      links {
        label
        url
      }
      skills {
        name
        category
      }
      experience {
        company
        position
        startDate
        endDate
        isCurrent
        achievements {
          text
        }
      }
      projects {
        name
        url
      }
    }
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; extensions?: { code?: string } }[];
}

describe('GraphQL profile (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let profileId: number;

  const gql = async <T>(query: string): Promise<GraphQLResponse<T>> => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    return response.body as GraphQLResponse<T>;
  };

  /** Runs `fn` and returns how many SQL statements Prisma executed meanwhile. */
  const countQueries = async (fn: () => Promise<unknown>): Promise<number> => {
    let count = 0;
    prisma.$on('query', () => {
      count += 1;
    });
    await fn();
    return count;
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
    profileId = await seedProfile(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the profile with all nested data in one request', async () => {
    const { data, errors } = await gql<{ profile: Record<string, unknown> }>(
      FULL_PROFILE_QUERY,
    );

    expect(errors).toBeUndefined();
    expect(data?.profile).toMatchObject({
      name: profileSeed.name,
      description: profileSeed.description,
      links: profileSeed.links,
      skills: profileSeed.skills,
      projects: profileSeed.projects.map(({ name, url }) => ({ name, url })),
    });

    const [current] = data?.profile.experience as {
      company: string;
      startDate: string;
      endDate: string | null;
      isCurrent: boolean;
      achievements: { text: string }[];
    }[];
    const expected = profileSeed.experience[0];
    expect(current).toMatchObject({
      company: expected.company,
      startDate: `${expected.start}-01`,
      endDate: null,
      isCurrent: true,
      achievements: expected.achievements.map((text) => ({ text })),
    });
  });

  it('supports the exact query from the assignment', async () => {
    const { data, errors } = await gql<{ profile: unknown }>(`
      query {
        profile {
          name
          description
          skills { name }
          experience { company position }
          projects { name }
        }
      }
    `);

    expect(errors).toBeUndefined();
    expect(data?.profile).toBeDefined();
  });

  it('returns NOT_FOUND for an unknown slug', async () => {
    const { errors } = await gql(`{ profile(slug: "missing") { name } }`);

    expect(errors?.[0].extensions?.code).toBe('NOT_FOUND');
  });

  it('logs the client IP of GraphQL requests but not of health checks', async () => {
    const log = jest.spyOn(Logger.prototype, 'log').mockImplementation();
    const server = app.getHttpServer();

    await request(server).post('/graphql').send({ query: '{ __typename }' });
    await request(server).get('/health').expect(200);
    await new Promise((resolve) => setImmediate(resolve));

    const lines = log.mock.calls.map(([message]) => String(message));
    log.mockRestore();

    expect(lines).toEqual([
      expect.stringMatching(/^POST \/graphql 200 \d+ms ip=\S+$/),
    ]);
  });

  describe('N+1 guard', () => {
    // 1 profile + links + skills + experience + projects + achievements
    const EXPECTED_QUERIES = 6;

    it('executes a fixed number of SQL queries for the full profile', async () => {
      const queries = await countQueries(() => gql(FULL_PROFILE_QUERY));
      expect(queries).toBe(EXPECTED_QUERIES);
    });

    it('does not issue more queries when the amount of nested data grows', async () => {
      for (let i = 0; i < 10; i++) {
        await prisma.experience.create({
          data: {
            profileId,
            company: `Extra company ${i}`,
            position: 'Engineer',
            startDate: new Date(Date.UTC(2000 + i, 0, 1)),
            endDate: new Date(Date.UTC(2001 + i, 0, 1)),
            sortOrder: 100 + i,
            achievements: {
              create: [
                { text: 'a', sortOrder: 0 },
                { text: 'b', sortOrder: 1 },
              ],
            },
          },
        });
      }

      let experienceCount = 0;
      const queries = await countQueries(async () => {
        const { data } = await gql<{ profile: { experience: unknown[] } }>(
          FULL_PROFILE_QUERY,
        );
        experienceCount = data?.profile.experience.length ?? 0;
      });

      expect(experienceCount).toBe(profileSeed.experience.length + 10);
      expect(queries).toBe(EXPECTED_QUERIES);
    });
  });

  it('seed is idempotent and prunes rows removed from seed data', async () => {
    // previous test added extra experience rows that are not in seed data
    await seedProfile(prisma);
    await seedProfile(prisma);

    const [profiles, skills, experience] = await Promise.all([
      prisma.profile.count(),
      prisma.skill.count(),
      prisma.experience.count(),
    ]);
    expect(profiles).toBe(1);
    expect(skills).toBe(profileSeed.skills.length);
    expect(experience).toBe(profileSeed.experience.length);
  });
});

describe('GraphQL query depth limit (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    jest
      .spyOn(AppConfigService.prototype, 'graphqlMaxDepth', 'get')
      .mockReturnValue(2);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  const post = (query: string) =>
    request(app.getHttpServer()).post('/graphql').send({ query });

  it('accepts queries within the limit', async () => {
    const response = await post('{ profile { skills { name } } }');
    expect(response.status).toBe(200);
    expect(response.body).not.toHaveProperty('errors');
  });

  it('rejects queries deeper than the limit before touching the database', async () => {
    const response = await post(
      '{ profile { experience { achievements { text } } } }',
    );
    expect(response.status).toBe(400);
    expect(JSON.stringify(response.body)).toMatch(
      /exceeds maximum operation depth of 2/,
    );
  });
});
