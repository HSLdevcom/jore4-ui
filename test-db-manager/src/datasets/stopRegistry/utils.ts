import { StopRegistryKeyValuesInput } from '../../generated/graphql';
import { KnownValueKey } from '../../types';
import { isNotNullish } from '../../utils';

export const getKeyValue = (
  key: KnownValueKey,
  value: string | boolean | number | null | undefined,
  defaultValue?: string | boolean | number,
): StopRegistryKeyValuesInput | null => {
  if (isNotNullish(value)) {
    return { key, values: [value.toString()] };
  }

  if (isNotNullish(defaultValue)) {
    return { key, values: [defaultValue.toString()] };
  }

  return null;
};
