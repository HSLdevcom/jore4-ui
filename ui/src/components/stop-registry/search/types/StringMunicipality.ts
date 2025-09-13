import { StopRegistryMunicipality } from '../../../../types/enums';
import { numberEnumKeys } from '../../../../utils';

export const knownMunicipalities = Object.freeze(
  numberEnumKeys(StopRegistryMunicipality),
);

export type StringMunicipality = keyof typeof StopRegistryMunicipality;
