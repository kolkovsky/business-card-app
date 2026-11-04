import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Project')
export class ProjectModel {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field({ description: 'Link to the project or its repository' })
  url!: string;
}
