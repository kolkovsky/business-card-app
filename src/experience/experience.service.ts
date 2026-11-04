import { Injectable } from '@nestjs/common';
import type { Achievement, Experience } from '@prisma/client';
import { groupByKey } from '../common/group-by-key';
import { ExperienceRepository } from './experience.repository';

@Injectable()
export class ExperienceService {
  constructor(private readonly repository: ExperienceRepository) {}

  /** Batch lookup: result[i] contains the experience of profileIds[i]. */
  async findByProfileIds(
    profileIds: readonly number[],
  ): Promise<Experience[][]> {
    const items = await this.repository.findByProfileIds(profileIds);
    return groupByKey(profileIds, items, (item) => item.profileId);
  }

  /** Batch lookup: result[i] contains the achievements of experienceIds[i]. */
  async findAchievementsByExperienceIds(
    experienceIds: readonly number[],
  ): Promise<Achievement[][]> {
    const achievements =
      await this.repository.findAchievementsByExperienceIds(experienceIds);
    return groupByKey(experienceIds, achievements, (a) => a.experienceId);
  }

  isCurrent(experience: Pick<Experience, 'endDate'>): boolean {
    return experience.endDate === null;
  }
}
