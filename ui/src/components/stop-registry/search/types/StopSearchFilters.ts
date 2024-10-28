import pick from 'lodash/pick';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { StopRegistryMunicipality } from '../../../../types/enums';
import { AllOptionEnum, areEqual } from '../../../../utils';
import { instanceOfDateTime, requiredString } from '../../../forms/common';
import { SearchBy } from './SearchBy';
import { SearchFor } from './SearchFor';

export const stopSearchFiltersSchema = z.object({
  query: requiredString,
  searchBy: z.nativeEnum(SearchBy),
  searchFor: z.nativeEnum(SearchFor),
  observationDate: instanceOfDateTime,
  elyNumber: z.string(),
  municipalities: z.array(
    z.union([
      z.nativeEnum(StopRegistryMunicipality),
      z.nativeEnum(AllOptionEnum),
    ]),
  ),
});

export type StopSearchFilters = z.infer<typeof stopSearchFiltersSchema>;

export const defaultFilters: StopSearchFilters = {
  query: '',
  searchBy: SearchBy.LabelOrName,
  searchFor: SearchFor.Stops,
  observationDate: DateTime.now().startOf('day'),
  elyNumber: '',
  municipalities: [AllOptionEnum.All],
};

export function pickMeaningfulFilters(filters: StopSearchFilters) {
  return pick(
    filters,
    'query',
    'observationDate',
    'elyNumber',
    'municipalities',
  );
}

export const emptyMeaningfulFilters = pickMeaningfulFilters(defaultFilters);
export function hasMeaningfulFilters(filters: StopSearchFilters) {
  return !areEqual(emptyMeaningfulFilters, pickMeaningfulFilters(filters));
}
