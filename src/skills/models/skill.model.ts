import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Skill')
export class SkillModel {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => String, {
    nullable: true,
    description: 'Grouping such as "Languages" or "Backend"',
  })
  category!: string | null;
}
