import { convertArrayTypeForHasura } from './graphql';

describe(`${convertArrayTypeForHasura.name}()`, () => {
  test('Should convert string array correctly', () => {
    const input = ['[first]', 'second', 'third'];
    const output = convertArrayTypeForHasura<string>(input);
    expect(output).toBe('{[first],second,third}');
  });

  test('Should convert nested arrays correctly', () => {
    const input = [[1, 2, 3], [4, 5], [6]];
    const output = convertArrayTypeForHasura<number[]>(input);
    expect(output).toBe('{{1,2,3},{4,5},{6}}');
  });
});
