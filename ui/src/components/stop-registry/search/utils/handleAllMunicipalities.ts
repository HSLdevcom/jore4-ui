import { StopRegistryMunicipality } from '../../../../types/enums';
import { AllOptionEnum, numberEnumValues } from '../../../../utils';

export const knownMunicipalities: ReadonlyArray<StopRegistryMunicipality> =
  numberEnumValues(StopRegistryMunicipality);

export function handleAllMunicipalities(
  selected: ReadonlyArray<StopRegistryMunicipality | AllOptionEnum.All>,
): Array<StopRegistryMunicipality | AllOptionEnum> {
  if (
    selected.length === 0 ||
    selected.includes(AllOptionEnum.All) ||
    knownMunicipalities.every((known) => selected.includes(known))
  ) {
    return [AllOptionEnum.All];
  }

  return [...selected];
}
