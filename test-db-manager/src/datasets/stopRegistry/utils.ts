import { StopRegistryKeyValuesInput } from '../../generated/graphql';
import { KnownValueKey } from '../../types';
import { isNotNullish } from '../../utils';

export const getKeyValue = (
  key: KnownValueKey,
  value: string | boolean | null | undefined,
): StopRegistryKeyValuesInput | null => {
  if (isNotNullish(value)) {
    return {
      key,
      values: [value.toString()],
    };
  }
  return null;
};
