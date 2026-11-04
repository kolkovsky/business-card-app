import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { ExperienceService } from '../experience/experience.service';
import { LinksService } from '../links/links.service';
import { ProjectsService } from '../projects/projects.service';
import { SkillsService } from '../skills/skills.service';
import type { Loaders } from './loaders';

/**
 * Singleton factory producing a fresh set of loaders per request.
 * Loaders are created in the GraphQL context instead of request-scoped
 * providers so that the whole DI graph stays singleton (no per-request
 * instantiation of services) while the cache is still isolated per request.
 */
@Injectable()
export class LoadersFactory {
  constructor(
    private readonly links: LinksService,
    private readonly skills: SkillsService,
    private readonly experience: ExperienceService,
    private readonly projects: ProjectsService,
  ) {}

  create(): Loaders {
    return {
      linksByProfileId: new DataLoader((ids) =>
        this.links.findByProfileIds(ids),
      ),
      skillsByProfileId: new DataLoader((ids) =>
        this.skills.findByProfileIds(ids),
      ),
      experienceByProfileId: new DataLoader((ids) =>
        this.experience.findByProfileIds(ids),
      ),
      achievementsByExperienceId: new DataLoader((ids) =>
        this.experience.findAchievementsByExperienceIds(ids),
      ),
      projectsByProfileId: new DataLoader((ids) =>
        this.projects.findByProfileIds(ids),
      ),
    };
  }
}
