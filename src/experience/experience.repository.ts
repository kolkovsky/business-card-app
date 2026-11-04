import { Injectable } from '@nestjs/common';
import type { Achievement, Experience } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  findAchievementsByExperienceIds(
    experienceIds: readonly number[],
  ): Promise<Achievement[]> {
    return this.prisma.achievement.findMany({
      where: { experienceId: { in: [...experienceIds] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
