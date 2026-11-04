import { Kind } from 'graphql';
import { LocalDateScalar } from './local-date.scalar';

describe('LocalDateScalar', () => {
  it('serializes Date to YYYY-MM-DD', () => {
    expect(LocalDateScalar.serialize(new Date('2023-01-01T00:00:00Z'))).toBe(
      '2023-01-01',
    );
  });

  it('parses a valid date string', () => {
    expect(LocalDateScalar.parseValue('2020-06-15')).toEqual(
      new Date('2020-06-15T00:00:00Z'),
    );
  });

  it('parses a string literal', () => {
    expect(
      LocalDateScalar.parseLiteral({ kind: Kind.STRING, value: '2020-06-15' }),
    ).toEqual(new Date('2020-06-15T00:00:00Z'));
  });

  it.each(['2020-6-1', '2020-13-01', 'yesterday'])('rejects "%s"', (value) => {
    expect(() => LocalDateScalar.parseValue(value)).toThrow(/YYYY-MM-DD/);
  });

  it('rejects non-string literals', () => {
    expect(() =>
      LocalDateScalar.parseLiteral({ kind: Kind.INT, value: '2020' }),
    ).toThrow();
  });
});
