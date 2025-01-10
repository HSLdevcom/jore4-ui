import { StopRegistryShelterEquipment } from '../../../../../../generated/graphql';

export function hasDuplicateShelters(
  shelters: ReadonlyArray<StopRegistryShelterEquipment> | null | undefined,
): boolean {
  if (!shelters || shelters.length < 2) {
    return false;
  }

  const aRecord = shelters[0] as Record<string, unknown>;
  for (let i = 1; i < shelters.length; i += 1) {
    const bRecord = shelters[i] as Record<string, unknown>;

    const equal = Object.entries(aRecord).every(([aKey, aValue]) => {
      if (aKey === 'id') {
        return true;
      }

      const bValue = bRecord[aKey];
      // Treat undefined as === to null
      return (aValue ?? null) === (bValue ?? null);
    });

    if (equal) {
      return true;
    }
  }

  return false;
}
