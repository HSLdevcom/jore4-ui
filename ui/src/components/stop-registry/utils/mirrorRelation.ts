import { StopRegistryKeyValues } from '../../../generated/graphql';
import {
  ElementWithKeyValues,
  KnownValueKey,
  findKeyValue,
  setKeyValue,
} from '../../../utils';

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
