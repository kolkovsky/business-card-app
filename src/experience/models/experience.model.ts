import { Field, ID, ObjectType } from '@nestjs/graphql';
import { LocalDateScalar } from '../../common/scalars/local-date.scalar';
import { AchievementModel } from './achievement.model';

@ObjectType('Experience', { description: 'Work experience entry' })
export class ExperienceModel {
  @Field(() => ID)
  id!: number;

  @Field()
  company!: string;

  @Field()
  position!: string;

  @Field(() => String, { nullable: true })
  location!: string | null;

  @Field(() => LocalDateScalar)
  startDate!: Date;

  @Field(() => LocalDateScalar, {
    nullable: true,
    description: 'null for the current position',
  })
  endDate!: Date | null;

  // Resolved by ExperienceResolver
  @Field({ description: 'True if the person still works here' })
  isCurrent?: boolean;

  @Field(() => [AchievementModel])
  achievements?: AchievementModel[];
}
