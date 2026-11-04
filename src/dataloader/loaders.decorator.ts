import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { GqlContext } from '../graphql/graphql-context';
import type { Loaders } from './loaders';

/** Injects the request-scoped DataLoaders into a resolver method. */
export const RequestLoaders = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Loaders =>
    GqlExecutionContext.create(context).getContext<GqlContext>().loaders,
);
