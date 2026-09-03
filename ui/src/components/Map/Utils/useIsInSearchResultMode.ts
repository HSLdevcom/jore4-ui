import omit from 'lodash/omit';
import { areEqual } from '../../../utils';
import { StopSearchFilters, defaultFilters } from '../../stop-registry';
import { useMapUrlStateContext } from './mapUrlState';

const defaultFiltersWithoutObservationDate = omit(
  defaultFilters,
  'observationDate',
);

/**
 * Are any search filters, other than observationDate, present.
 * ObservationDate is a generic query param, used outside the search
 * results as well as within. Search by mere observationDate is not
 * possible. Thus, if it is the only filter present, we are not displaying
 * search results.
 *
 * @param filters
 */
export function hasSearchFilters(filters: StopSearchFilters) {
  return !areEqual(
    defaultFiltersWithoutObservationDate,
    omit(filters, 'observationDate'),
  );
}

/**
 * Is the map in "Show search results on map" -mode.
 */
export function useIsInSearchResultMode() {
  const {
    state: { filters },
  } = useMapUrlStateContext();
  return hasSearchFilters(filters);
}
