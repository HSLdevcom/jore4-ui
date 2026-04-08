import omit from 'lodash/omit';
import {
  StopRegistryKeyValues,
  StopRegistryKeyValuesInput,
} from '../../generated/graphql';
import { ElementWithKeyValues, findKeyValue } from '../findKeyValue';
import { KnownValueKey } from '../knownValueKey';
import { setKeyValue } from './stopPlace';

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

export function getMirroredByIds(quay: ElementWithKeyValues): string[] {
  const entry = quay.keyValues?.find(
    (kv) => kv?.key === KnownValueKey.MirroredBy,
  );
  return (entry?.values?.filter(Boolean) as string[]) ?? [];
}

export function isMirrorChild(quay: ElementWithKeyValues): boolean {
  return getMirrorParentId(quay) !== null;
}

export function isMirrorParent(quay: ElementWithKeyValues): boolean {
  return getMirroredByIds(quay).length > 0;
}

export function setMirrorParent(
  childKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  parentNetexId: string,
): (StopRegistryKeyValues | null)[] {
  return setKeyValue(childKeyValues, KnownValueKey.Mirrors, [parentNetexId]);
}

export function addMirroredBy(
  parentKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  childNetexId: string,
): (StopRegistryKeyValues | null)[] {
  const existing = parentKeyValues?.find(
    (kv) => kv?.key === KnownValueKey.MirroredBy,
  );
  const currentIds = (existing?.values?.filter(Boolean) as string[]) ?? [];

  if (currentIds.includes(childNetexId)) {
    return (parentKeyValues ?? []).slice();
  }

  return setKeyValue(parentKeyValues, KnownValueKey.MirroredBy, [
    ...currentIds,
    childNetexId,
  ]);
}

export function removeMirroredBy(
  parentKeyValues: ReadonlyArray<StopRegistryKeyValues | null> | undefined,
  childNetexId: string,
): (StopRegistryKeyValues | null)[] {
  const existing = parentKeyValues?.find(
    (kv) => kv?.key === KnownValueKey.MirroredBy,
  );
  const currentIds = (existing?.values?.filter(Boolean) as string[]) ?? [];
  const updated = currentIds.filter((id) => id !== childNetexId);

  return setKeyValue(parentKeyValues, KnownValueKey.MirroredBy, updated);
}
