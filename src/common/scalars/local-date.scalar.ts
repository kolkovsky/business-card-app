import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parse(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!LOCAL_DATE_RE.test(value) || Number.isNaN(date.getTime())) {
    throw new GraphQLError(
      `LocalDate must be in YYYY-MM-DD format, got "${value}"`,
    );
  }
  return date;
}

/** Calendar date without time zone, serialised as ISO 8601 `YYYY-MM-DD`. */
export const LocalDateScalar = new GraphQLScalarType<Date, string>({
  name: 'LocalDate',
  description: 'Calendar date without time, ISO 8601 (YYYY-MM-DD)',
  serialize(value) {
    if (!(value instanceof Date)) {
      throw new GraphQLError('LocalDate can only serialize Date instances');
    }
    return value.toISOString().slice(0, 10);
  },
  parseValue(value) {
    if (typeof value !== 'string') {
      throw new GraphQLError('LocalDate must be a string');
    }
    return parse(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('LocalDate must be a string');
    }
    return parse(ast.value);
  },
});
