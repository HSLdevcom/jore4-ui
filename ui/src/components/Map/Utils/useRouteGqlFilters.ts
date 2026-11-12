import compact from 'lodash/compact';
import { useMemo } from 'react';
import { RouteRouteBoolExp } from '../../../generated/graphql';
import {
  ActiveTimeAndPriorityFilters,
  FilterType,
  selectMapFilter,
  useAppSelector,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { buildActiveDateGqlFilter } from '../../../utils';
import { useMapObservationDate } from './mapUrlState';

/**
 * Routes shown on "Show situation on the selected date" mode are narrowed down
 * to a single version per label+variant+direction only after fetching.
 */
const highestPriorityCurrentPriorities = [
  Priority.Standard,
  Priority.Temporary,
];

function buildTimeGqlFilter(
  observationDate: Temporal.PlainDate,
  activeFilters: ReadonlyArray<FilterType>,
): RouteRouteBoolExp {
  const conditions = compact([
    activeFilters.includes(FilterType.ShowCurrent)
      ? buildActiveDateGqlFilter(observationDate)
      : null,
    activeFilters.includes(FilterType.ShowFuture)
      ? { validity_start: { _gt: observationDate } }
      : null,
    activeFilters.includes(FilterType.ShowPast)
      ? { validity_end: { _lt: observationDate } }
      : null,
  ]);

  // No active time filter must not match everything.
  if (!conditions.length) {
    return { route_id: { _is_null: true } };
  }

  return { _or: conditions };
}

type RouteGqlFilters = {
  readonly routeFilters: RouteRouteBoolExp;
  readonly showHighestPriorityCurrent: boolean;
};

/**
 * Maps the shared time and priority filters of the map filter panel into
 * GraphQL conditions for routes.
 */
export function buildRouteGqlFilters(
  timeAndPriorityFilters: ActiveTimeAndPriorityFilters,
  observationDate: Temporal.PlainDate,
): RouteGqlFilters {
  const showHighestPriorityCurrent =
    timeAndPriorityFilters[FilterType.ShowHighestPriorityCurrent];

  if (showHighestPriorityCurrent) {
    return {
      routeFilters: {
        ...buildActiveDateGqlFilter(observationDate),
        priority: { _in: highestPriorityCurrentPriorities },
      },
      showHighestPriorityCurrent,
    };
  }

  const activeTimeFilters = [
    FilterType.ShowCurrent,
    FilterType.ShowFuture,
    FilterType.ShowPast,
  ].filter((filterType) => timeAndPriorityFilters[filterType]);

  const activePriorities = compact([
    timeAndPriorityFilters[FilterType.ShowStandard] ? Priority.Standard : null,
    timeAndPriorityFilters[FilterType.ShowTemporary]
      ? Priority.Temporary
      : null,
    timeAndPriorityFilters[FilterType.ShowDraft] ? Priority.Draft : null,
  ]);

  return {
    routeFilters: {
      ...buildTimeGqlFilter(observationDate, activeTimeFilters),
      priority: { _in: activePriorities },
    },
    showHighestPriorityCurrent,
  };
}

/**
 * Hook wrapper for {@link buildRouteGqlFilters}.
 */
export function useRouteGqlFilters(): RouteGqlFilters {
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);
  const observationDate = useMapObservationDate();

  return useMemo(
    () => buildRouteGqlFilters(timeAndPriorityFilters, observationDate),
    [observationDate, timeAndPriorityFilters],
  );
}
