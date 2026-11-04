import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Achievement')
export class AchievementModel {
  @Field(() => ID)
  id!: number;

  @Field()
  text!: string;
}
