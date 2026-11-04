import { Injectable } from '@nestjs/common';
import type { Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
