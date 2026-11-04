import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import type { Experience, Link, Profile, Project, Skill } from '@prisma/client';
import { RequestLoaders } from '../dataloader/loaders.decorator';
import type { Loaders } from '../dataloader/loaders';
import { ExperienceModel } from '../experience/models/experience.model';
import { LinkModel } from '../links/models/link.model';
import { ProjectModel } from '../projects/models/project.model';
import { SkillModel } from '../skills/models/skill.model';
import { ProfileModel } from './models/profile.model';
import { ProfileService } from './profile.service';

/**
 * GraphQL layer only: maps the schema to services. Nested collections are
 * resolved through DataLoaders, so each relation costs one SQL query per
 * request regardless of the number of parent rows (no N+1).
 */
@Resolver(() => ProfileModel)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => ProfileModel, {
    description: 'Business card profile. Without slug returns the owner.',
  })
  profile(
    @Args('slug', { type: () => String, nullable: true }) slug?: string,
  ): Promise<Profile> {
    return this.profileService.getProfile(slug ?? undefined);
  }

  @ResolveField(() => [LinkModel])
  links(
    @Parent() profile: Profile,
    @RequestLoaders() loaders: Loaders,
  ): Promise<Link[]> {
    return loaders.linksByProfileId.load(profile.id);
  }

  @ResolveField(() => [SkillModel])
  skills(
    @Parent() profile: Profile,
    @RequestLoaders() loaders: Loaders,
  ): Promise<Skill[]> {
    return loaders.skillsByProfileId.load(profile.id);
  }

  @ResolveField(() => [ExperienceModel])
  experience(
    @Parent() profile: Profile,
    @RequestLoaders() loaders: Loaders,
  ): Promise<Experience[]> {
    return loaders.experienceByProfileId.load(profile.id);
  }

  @ResolveField(() => [ProjectModel])
  projects(
    @Parent() profile: Profile,
    @RequestLoaders() loaders: Loaders,
  ): Promise<Project[]> {
    return loaders.projectsByProfileId.load(profile.id);
  }
}
