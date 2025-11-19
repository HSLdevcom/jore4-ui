import omit from 'lodash/omit';
import { DateTime } from 'luxon';
import { EnumLike, z } from 'zod';
import {
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../generated/graphql';
import { Priority } from '../../../../types/enums';
import {
  JoreStopRegistryTransportModeType,
  StopOwner,
  StopPlaceState,
} from '../../../../types/stop-registry';
import { AllOptionEnum, NullOptionEnum, areEqual } from '../../../../utils';
import { instanceOfDateTime, requiredString } from '../../../forms/common';
import { SearchBy } from './SearchBy';
import { SearchFor } from './SearchFor';
import { StringMunicipality, knownMunicipalities } from './StringMunicipality';

const allEnum = z.nativeEnum(AllOptionEnum);
const nullEnum = z.nativeEnum(NullOptionEnum);

function zMunicipalityEnumArray() {
  const municipalityEnum = z.enum(
    knownMunicipalities as [StringMunicipality, ...StringMunicipality[]],
  );
  return z.array(z.union([municipalityEnum, allEnum]));
}

function zEnumArrayWithAll<Elements extends EnumLike>(values: Elements) {
  return z.array(z.union([z.nativeEnum(values), allEnum]));
}

function zEnumArrayWithAllAndNull<Elements extends EnumLike>(values: Elements) {
  return z.array(z.union([z.nativeEnum(values), allEnum, nullEnum]));
}

const infoSpotSize = z.object({
  width: z.number().min(0),
  height: z.number().min(0),
});

export const stopSearchFiltersSchema = z.object({
  query: requiredString,
  searchBy: z.nativeEnum(SearchBy),
  searchFor: z.nativeEnum(SearchFor),
  observationDate: instanceOfDateTime,
  elyNumber: z.string(),
  municipalities: zMunicipalityEnumArray(),
  priorities: z.array(z.nativeEnum(Priority)).min(1),
  transportationMode: zEnumArrayWithAll(JoreStopRegistryTransportModeType),
  stopState: zEnumArrayWithAll(StopPlaceState),
  shelter: zEnumArrayWithAllAndNull(StopRegistryShelterType),
  electricity: zEnumArrayWithAllAndNull(StopRegistryShelterElectricity),
  infoSpots: z.array(z.union([infoSpotSize, allEnum, nullEnum])),
  stopOwner: zEnumArrayWithAll(StopOwner),
});

export type InfoSpotSize = z.infer<typeof infoSpotSize>;
export type StopSearchFilters = z.infer<typeof stopSearchFiltersSchema>;

export const defaultFilters: StopSearchFilters = {
  query: '',
  searchBy: SearchBy.LabelOrName,
  searchFor: SearchFor.Stops,
  observationDate: DateTime.now().startOf('day'),
  elyNumber: '',
  municipalities: [AllOptionEnum.All],
  priorities: [Priority.Standard, Priority.Temporary],
  transportationMode: [AllOptionEnum.All],
  stopState: [AllOptionEnum.All],
  shelter: [AllOptionEnum.All],
  electricity: [AllOptionEnum.All],
  infoSpots: [AllOptionEnum.All],
  stopOwner: [AllOptionEnum.All],
};

export function pickMeaningfulFilters(filters: StopSearchFilters) {
  return omit(filters, ['searchBy', 'searchFor']);
}

export const emptyMeaningfulFilters = pickMeaningfulFilters(defaultFilters);
export function hasMeaningfulFilters(filters: StopSearchFilters) {
  return !areEqual(emptyMeaningfulFilters, pickMeaningfulFilters(filters));
}
