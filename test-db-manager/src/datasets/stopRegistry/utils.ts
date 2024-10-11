import { StopRegistryKeyValuesInput } from '../../generated/graphql';
import { isNotNullish } from '../../utils';

export const getKeyValue = (
  key: string,
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
