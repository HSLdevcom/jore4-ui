import { queryToLike } from './search';

describe('queryToLike', () => {
  const testData: ReadonlyArray<readonly [string, string | null]> = [
    ['   ', null], // Just whitespace -> trimmed away -> null
    ['\n\t\v    ', null], // Complex whitespace -> null
    ['%', null], // Single wildcard -> Matched all -> null
    ['*', null], // Single wildcard -> Matched all -> null
    [' % ', null], // Single wildcard with trimmed whitespace
    [' * ', null], // Single wildcard with trimmed whitespace
    ['%%', null], // Run of wildcards -> Match all -> null
    ['**', null], // Run of wildcards -> Match all -> null
    ['%*', null], // Mixed run of wildcards -> Match all -> null
    ['\\%%*', '\\%'], // Escaped wildcard with wildcard -> Keep escaped
    ['\\**%', '\\%'], // Escaped wildcard with wildcard -> Keep escaped
    [' word ', 'word'], // Trim but keep text
    ['*  w  d  %', '% w d %'], // Trim internal whitespace, but keep text and wildcards
  ];

  testData.forEach(([input, output]) =>
    it(`should map "${input}" to "${output}"`, () =>
      expect(queryToLike(input)).toBe(output)),
  );
});
