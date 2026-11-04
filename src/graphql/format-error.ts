import { unwrapResolverError } from '@apollo/server/errors';
import { HttpException, HttpStatus } from '@nestjs/common';
import type { GraphQLFormattedError } from 'graphql';

const CODE_BY_STATUS: Partial<Record<number, string>> = {
  [HttpStatus.BAD_REQUEST]: 'BAD_USER_INPUT',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHENTICATED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
};

/**
 * Services throw transport-agnostic Nest HttpExceptions; this maps them to
 * conventional GraphQL error codes and strips internal details.
 */
export function formatGraphQLError(
  formatted: GraphQLFormattedError,
  error: unknown,
): GraphQLFormattedError {
  const original = unwrapResolverError(error);
  if (!(original instanceof HttpException)) {
    return formatted;
  }

  const status = original.getStatus();
  return {
    message: formatted.message,
    locations: formatted.locations,
    path: formatted.path,
    extensions: {
      code: CODE_BY_STATUS[status] ?? 'INTERNAL_SERVER_ERROR',
      status,
    },
  };
}
