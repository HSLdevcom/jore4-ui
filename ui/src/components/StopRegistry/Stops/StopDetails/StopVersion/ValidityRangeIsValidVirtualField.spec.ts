import { TFunction, keyFromSelector } from 'i18next';
import { Priority } from '../../../../../types/enums';
import { resolveErrorMessage } from './ValidityRangeIsValidVirtualField';

function mockT(selector: ExplicitAny) {
  return keyFromSelector(selector);
}

const t = mockT as unknown as TFunction;

describe(`${resolveErrorMessage.name}()`, () => {
  const stopAreaValidity = {
    validityStart: '2030-01-01',
    validityEnd: '2040-12-31',
  };

  test('rejects a stop validity period ending after the stop area', () => {
    const error = resolveErrorMessage(
      t,
      Priority.Standard,
      '2031-01-01',
      '2041-01-01',
      false,
      [],
      true,
      true,
      stopAreaValidity,
    );

    expect(error).toBe('stops.stopAreaValidityNotEnough');
  });

  test('rejects an indefinite stop validity period when the stop area has an end date', () => {
    const error = resolveErrorMessage(
      t,
      Priority.Standard,
      '2031-01-01',
      undefined,
      true,
      [],
      true,
      true,
      stopAreaValidity,
    );

    expect(error).toBe('stops.stopAreaValidityNotEnough');
  });

  test('accepts a stop validity period matching the stop area boundaries', () => {
    const error = resolveErrorMessage(
      t,
      Priority.Standard,
      '2030-01-01',
      '2040-12-31',
      false,
      [],
      true,
      true,
      stopAreaValidity,
    );

    expect(error).toBeNull();
  });
});
