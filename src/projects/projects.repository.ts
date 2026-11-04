import { Injectable } from '@nestjs/common';
import type { Project } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByProfileIds(profileIds: readonly number[]): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }
}
