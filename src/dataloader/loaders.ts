import type DataLoader from 'dataloader';
import type {
  Achievement,
  Experience,
  Link,
  Project,
  Skill,
} from '@prisma/client';

/**
 * Batched loaders for every one-to-many relation exposed via GraphQL.
 * Each loader collects keys requested during one tick of execution and
 * resolves them with a single SQL query (WHERE fk IN (...)).
 */
export interface Loaders {
  linksByProfileId: DataLoader<number, Link[]>;
  skillsByProfileId: DataLoader<number, Skill[]>;
  experienceByProfileId: DataLoader<number, Experience[]>;
  achievementsByExperienceId: DataLoader<number, Achievement[]>;
  projectsByProfileId: DataLoader<number, Project[]>;
}
