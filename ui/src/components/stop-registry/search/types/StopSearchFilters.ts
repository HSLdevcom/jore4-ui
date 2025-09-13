import omit from 'lodash/omit';
import { DateTime } from 'luxon';
import { EnumLike, ZodEnum, z } from 'zod';
import {
  StopRegistryShelterElectricity,
  StopRegistryShelterType,
} from '../../../../generated/graphql';
import { Priority, StopRegistryMunicipality } from '../../../../types/enums';
import {
  JoreStopRegistryTransportModeType,
  StopPlaceState,
} from '../../../../types/stop-registry';
import { AllOptionEnum, NullOptionEnum, areEqual } from '../../../../utils';
import { instanceOfDateTime, requiredString } from '../../../forms/common';
import { SearchBy } from './SearchBy';
import { SearchFor } from './SearchFor';
import { StringMunicipality, knownMunicipalities } from './StringMunicipality';

const allEnum = z.nativeEnum(AllOptionEnum);

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
  return z.array(
    z.union([z.nativeEnum(values), allEnum, z.nativeEnum(NullOptionEnum)]),
  );
}

export const infoSpotSize = z.object({
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
  infoSpots: z.object({
    noInfoSpots: z.boolean(),
    sizes: z.array(infoSpotSize),
  }),
});

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
  infoSpots: { noInfoSpots: false, sizes: [] },
};

export function pickMeaningfulFilters(filters: StopSearchFilters) {
  return omit(filters, ['searchBy', 'searchFor']);
}

export const emptyMeaningfulFilters = pickMeaningfulFilters(defaultFilters);
export function hasMeaningfulFilters(filters: StopSearchFilters) {
  return !areEqual(emptyMeaningfulFilters, pickMeaningfulFilters(filters));
}
