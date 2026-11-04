import { Injectable } from '@nestjs/common';
import type { Skill } from '@prisma/client';
import { groupByKey } from '../common/group-by-key';
import { SkillsRepository } from './skills.repository';

@Injectable()
export class SkillsService {
  constructor(private readonly repository: SkillsRepository) {}

  /** Batch lookup: result[i] contains the skills of profileIds[i]. */
  async findByProfileIds(profileIds: readonly number[]): Promise<Skill[][]> {
    const skills = await this.repository.findByProfileIds(profileIds);
    return groupByKey(profileIds, skills, (skill) => skill.profileId);
  }
}
