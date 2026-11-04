import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import type { Achievement, Experience } from '@prisma/client';
import { RequestLoaders } from '../dataloader/loaders.decorator';
import type { Loaders } from '../dataloader/loaders';
import { ExperienceService } from './experience.service';
import { AchievementModel } from './models/achievement.model';
import { ExperienceModel } from './models/experience.model';

@Resolver(() => ExperienceModel)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @ResolveField(() => Boolean)
  isCurrent(@Parent() experience: Experience): boolean {
    return this.experienceService.isCurrent(experience);
  }

  @ResolveField(() => [AchievementModel])
  achievements(
    @Parent() experience: Experience,
    @RequestLoaders() loaders: Loaders,
  ): Promise<Achievement[]> {
    return loaders.achievementsByExperienceId.load(experience.id);
  }
}
