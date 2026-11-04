import { Injectable } from '@nestjs/common';
import type { Project } from '@prisma/client';
import { groupByKey } from '../common/group-by-key';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private readonly repository: ProjectsRepository) {}

  /** Batch lookup: result[i] contains the projects of profileIds[i]. */
  async findByProfileIds(profileIds: readonly number[]): Promise<Project[][]> {
    const projects = await this.repository.findByProfileIds(profileIds);
    return groupByKey(profileIds, projects, (project) => project.profileId);
  }
}
