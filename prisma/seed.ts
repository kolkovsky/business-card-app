import { Prisma, PrismaClient } from '@prisma/client';
import { ProfileSeed, profileSeed } from './seed-data';

type Tx = Prisma.TransactionClient;

/** "2023-01" -> 2023-01-01T00:00:00Z */
function monthToDate(month: string): Date {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    throw new Error(`Invalid month "${month}", expected YYYY-MM`);
  }
  return new Date(`${month}-01T00:00:00.000Z`);
}

/**
 * Synchronises the database with the seed data.
 *
 * Idempotent: rows are upserted by natural keys and rows that are no longer
 * present in the seed are removed, so running it any number of times yields
 * the same state with stable ids. Everything runs in one transaction.
 */
export async function seedProfile(
  prisma: PrismaClient,
  data: ProfileSeed = profileSeed,
): Promise<number> {
  return prisma.$transaction(
    async (tx) => {
      const profileFields = {
        name: data.name,
        headline: data.headline,
        description: data.description,
        location: data.location ?? null,
        email: data.email ?? null,
      };
      const profile = await tx.profile.upsert({
        where: { slug: data.slug },
        create: { slug: data.slug, ...profileFields },
        update: profileFields,
      });

      await syncLinks(tx, profile.id, data);
      await syncSkills(tx, profile.id, data);
      await syncExperience(tx, profile.id, data);
      await syncProjects(tx, profile.id, data);

      return profile.id;
    },
    { timeout: 30_000 },
  );
}

async function syncLinks(tx: Tx, profileId: number, data: ProfileSeed) {
  for (const [sortOrder, link] of data.links.entries()) {
    await tx.link.upsert({
      where: { profileId_label: { profileId, label: link.label } },
      create: { profileId, ...link, sortOrder },
      update: { url: link.url, sortOrder },
    });
  }
  await tx.link.deleteMany({
    where: { profileId, label: { notIn: data.links.map((l) => l.label) } },
  });
}

async function syncSkills(tx: Tx, profileId: number, data: ProfileSeed) {
  for (const [sortOrder, skill] of data.skills.entries()) {
    await tx.skill.upsert({
      where: { profileId_name: { profileId, name: skill.name } },
      create: { profileId, ...skill, sortOrder },
      update: { category: skill.category, sortOrder },
    });
  }
  await tx.skill.deleteMany({
    where: { profileId, name: { notIn: data.skills.map((s) => s.name) } },
  });
}

async function syncExperience(tx: Tx, profileId: number, data: ProfileSeed) {
  const keptIds: number[] = [];

  for (const [sortOrder, item] of data.experience.entries()) {
    const startDate = monthToDate(item.start);
    const fields = {
      position: item.position,
      location: item.location ?? null,
      endDate: item.end ? monthToDate(item.end) : null,
      sortOrder,
    };
    const experience = await tx.experience.upsert({
      where: {
        profileId_company_startDate: {
          profileId,
          company: item.company,
          startDate,
        },
      },
      create: { profileId, company: item.company, startDate, ...fields },
      update: fields,
    });
    keptIds.push(experience.id);

    for (const [index, text] of item.achievements.entries()) {
      await tx.achievement.upsert({
        where: {
          experienceId_sortOrder: {
            experienceId: experience.id,
            sortOrder: index,
          },
        },
        create: { experienceId: experience.id, text, sortOrder: index },
        update: { text },
      });
    }
    await tx.achievement.deleteMany({
      where: {
        experienceId: experience.id,
        sortOrder: { gte: item.achievements.length },
      },
    });
  }

  await tx.experience.deleteMany({
    where: { profileId, id: { notIn: keptIds } },
  });
}

async function syncProjects(tx: Tx, profileId: number, data: ProfileSeed) {
  for (const [sortOrder, project] of data.projects.entries()) {
    const fields = {
      description: project.description ?? null,
      url: project.url,
      sortOrder,
    };
    await tx.project.upsert({
      where: { profileId_name: { profileId, name: project.name } },
      create: { profileId, name: project.name, ...fields },
      update: fields,
    });
  }
  await tx.project.deleteMany({
    where: { profileId, name: { notIn: data.projects.map((p) => p.name) } },
  });
}

async function main(): Promise<void> {
  const prisma = new PrismaClient();
  try {
    const profileId = await seedProfile(prisma);
    console.log(`Seed completed: profile #${profileId} is up to date`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error: unknown) => {
    console.error('Seed failed', error);
    process.exit(1);
  });
}
