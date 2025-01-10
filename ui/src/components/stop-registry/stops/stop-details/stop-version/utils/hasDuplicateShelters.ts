import { StopRegistryShelterEquipment } from '../../../../../../generated/graphql';

function compareShelters(
  shelterA: StopRegistryShelterEquipment,
  shelterB: StopRegistryShelterEquipment,
): boolean {
  const aRecord = shelterA as Record<string, unknown>;
  const bRecord = shelterB as Record<string, unknown>;

  return Object.entries(aRecord).every(([aKey, aValue]) => {
    if (aKey === 'id') {
      return true;
    }

    const bValue = bRecord[aKey];
    // Treat undefined as === to null
    return (aValue ?? null) === (bValue ?? null);
  });
}

export function hasDuplicateShelters(
  shelters: ReadonlyArray<StopRegistryShelterEquipment> | null | undefined,
): boolean {
  if (!shelters || shelters.length < 2) {
    return false;
  }

  for (let i = 0; i < shelters.length - 1; i += 1) {
    for (let j = i + 1; j < shelters.length; j += 1) {
      const equal = compareShelters(shelters[i], shelters[j]);

      if (equal) {
        return true;
      }
    }
  }

  return false;
}
