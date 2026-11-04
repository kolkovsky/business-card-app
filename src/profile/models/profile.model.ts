import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExperienceModel } from '../../experience/models/experience.model';
import { LinkModel } from '../../links/models/link.model';
import { ProjectModel } from '../../projects/models/project.model';
import { SkillModel } from '../../skills/models/skill.model';

@ObjectType('Profile', { description: 'Developer business card' })
export class ProfileModel {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'URL-friendly unique identifier' })
  slug!: string;

  @Field()
  name!: string;

  @Field({ description: 'Short professional title' })
  headline!: string;

  @Field({ description: 'Short description / summary' })
  description!: string;

  @Field(() => String, { nullable: true })
  location!: string | null;

  @Field(() => String, { nullable: true })
  email!: string | null;

  // Relations below are resolved lazily (and batched) by ProfileResolver
  @Field(() => [LinkModel])
  links?: LinkModel[];

  @Field(() => [SkillModel])
  skills?: SkillModel[];

  @Field(() => [ExperienceModel])
  experience?: ExperienceModel[];

  @Field(() => [ProjectModel])
  projects?: ProjectModel[];
}
