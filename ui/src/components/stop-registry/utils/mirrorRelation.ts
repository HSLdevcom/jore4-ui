import omit from 'lodash/omit';
import {
  StopRegistryKeyValues,
  StopRegistryKeyValuesInput,
} from '../../../generated/graphql';
import {
  ElementWithKeyValues,
  findKeyValue,
} from '../../../utils/findKeyValue';
import { KnownValueKey } from '../../../utils/knownValueKey';
import { setKeyValue } from '../../../utils/stop-registry/stopPlace';

export function stripKeyValueTypenames(
  keyValues: ReadonlyArray<StopRegistryKeyValues | null>,
): StopRegistryKeyValuesInput[] {
  return keyValues
    .filter(Boolean)
    .map((kv) => omit(kv, '__typename') as StopRegistryKeyValuesInput);
}

export function getMirrorParentId(quay: ElementWithKeyValues): string | null {
  return findKeyValue(quay, KnownValueKey.Mirrors);
}

export function isMirrorChild(quay: ElementWithKeyValues): boolean {
  return getMirrorParentId(quay) !== null;
}

export function setMirrorParent(
  childKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  parentNetexId: string,
): (StopRegistryKeyValues | null)[] {
  return setKeyValue(childKeyValues, KnownValueKey.Mirrors, [parentNetexId]);
}
