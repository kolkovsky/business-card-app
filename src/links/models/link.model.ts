import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Link', {
  description: 'Professional resource: GitHub, LinkedIn, etc.',
})
export class LinkModel {
  @Field(() => ID)
  id!: number;

  @Field({ description: 'Human readable name, e.g. "GitHub"' })
  label!: string;

  @Field()
  url!: string;
}
