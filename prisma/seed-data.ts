/**
 * Author data for the business card. Pure data, no logic:
 * edit this file and restart the app (or run `npm run db:seed`) to update the card.
 *
 * TODO(author): replace placeholder values with real data.
 */

export interface LinkSeed {
  label: string;
  url: string;
}

export interface SkillSeed {
  name: string;
  category: string;
}

export interface ExperienceSeed {
  company: string;
  position: string;
  location?: string;
  /** ISO month: YYYY-MM */
  start: string;
  /** ISO month: YYYY-MM; omit for current position */
  end?: string;
  achievements: string[];
}

export interface ProjectSeed {
  name: string;
  description?: string;
  url: string;
}

export interface ProfileSeed {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location?: string;
  email?: string;
  links: LinkSeed[];
  skills: SkillSeed[];
  experience: ExperienceSeed[];
  projects: ProjectSeed[];
}

export const profileSeed: ProfileSeed = {
  slug: 'stas-kolkovsky',
  name: 'Stas Kolkovsky',
  headline: 'Backend / Full-stack TypeScript Developer',
  description:
    'TypeScript developer focused on Node.js backends: API design, data modelling and reliable delivery from local Docker setup to production.',
  location: 'Remote',
  links: [
    { label: 'GitHub', url: 'https://github.com/your-github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-linkedin' },
  ],
  skills: [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'JavaScript', category: 'Languages' },
    { name: 'SQL', category: 'Languages' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'GraphQL', category: 'Backend' },
    { name: 'REST', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Data' },
    { name: 'Prisma', category: 'Data' },
    { name: 'S3', category: 'Infrastructure' },
    { name: 'Docker', category: 'Infrastructure' },
    { name: 'Git', category: 'Tools' },
    { name: 'Claude Code', category: 'Tools' },
  ],
  experience: [
    {
      company: 'Company Name',
      position: 'Senior Backend Developer',
      start: '2023-01',
      achievements: [
        'Designed a GraphQL API on NestJS consumed by web and mobile clients',
        'Eliminated N+1 queries with DataLoader, cutting p95 latency of key queries',
        'Containerised services with Docker and automated CI/CD pipelines',
      ],
    },
    {
      company: 'Previous Company',
      position: 'Backend Developer',
      start: '2020-06',
      end: '2022-12',
      achievements: [
        'Built REST services on Node.js and PostgreSQL',
        'Introduced versioned database migrations and integration tests',
      ],
    },
  ],
  projects: [
    {
      name: 'Digital Business Card API',
      description:
        'This project: NestJS + GraphQL + Prisma + PostgreSQL backend with batched nested resolvers.',
      url: 'https://github.com/your-github/it-solutions-assignment',
    },
  ],
};
