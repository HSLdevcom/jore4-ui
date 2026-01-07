import { StopRegistryKeyValuesInput } from '../../generated/graphql';
import { KeyValueKeysEnum } from '../../types';
import { isNotNullish } from '../../utils';

export const getKeyValue = (
  key: KeyValueKeysEnum,
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
