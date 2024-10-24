import {
  numberEnumEntries,
  numberEnumKeys,
  numberEnumValues,
} from './numberEnumHelpers';

describe('numberEnumHelpers', () => {
  enum TestEnum {
    A = 1,
    B,
    C,
  }

  it('should get proper entries', () => {
    expect(numberEnumEntries(TestEnum)).toEqual([
      ['A', 1],
      ['B', 2],
      ['C', 3],
    ]);
  });

  it('should get proper keys', () => {
    expect(numberEnumKeys(TestEnum)).toEqual(['A', 'B', 'C']);
  });

  it('should get proper values', () => {
    expect(numberEnumValues(TestEnum)).toEqual([1, 2, 3]);
  });
});
