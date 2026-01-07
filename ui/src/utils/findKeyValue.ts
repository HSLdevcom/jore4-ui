import {
  Maybe,
  StopRegistryKeyValues,
  StopRegistryKeyValuesInput,
} from '../generated/graphql';
import { KnownValueKey } from './knownValueKey';

export type ElementWithKeyValues = {
  readonly keyValues?: Maybe<
    ReadonlyArray<Maybe<StopRegistryKeyValues | StopRegistryKeyValuesInput>>
  >;
};

export function findKeyValue(
  element: ElementWithKeyValues,
  key: KnownValueKey,
): string | null {
  const keyValue = element.keyValues?.find((kv) => kv?.key === key);
  // Note: the "values" could be an array with many values.
  return keyValue?.values?.[0] ?? null;
}

export function findKeyValueParsed<T = string>(
  element: ElementWithKeyValues,
  key: KnownValueKey,
  parser: (arg0: string) => T,
): T | null {
  const keyValue = findKeyValue(element, key);
  if (keyValue === null) {
    return null;
  }
  return parser(keyValue);
}
