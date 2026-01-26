import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GetStopSelectionInfoQueryVariables,
  RouteRouteBoolExp,
  StopSelectionInfoFragment as StopSelectionInfo,
  StopSelectionInfoFragmentDoc,
  StopsDatabaseQuayNewestVersionBoolExp,
  useGetStopSelectionInfoQuery,
} from '../../../generated/graphql';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapStopSelection,
  selectMapStopSelection,
  setStopSelectionAction,
} from '../../../redux';
import { ResultSelection, StopSearchFilters } from '../../stop-registry';
import { filtersAndResultSelectionToQueryVariables } from '../../stop-registry/search/by-stop/filtersToQueryVariables';
import { DisplayedRouteParams } from '../types';
import { useMapUrlStateContext } from '../utils/mapUrlState';

const GQL_STOP_SELECTION_INFO_FRAGMENT = gql`
  fragment StopSelectionInfo on stops_database_quay_newest_version {
    netex_id
    public_code
    priority
    street_address

    stop_place: stop_place_newest_version {
      name_value
    }
  }
`;

const GQL_GET_STOP_SELECTION_INFO_ROWS_BY_IDS = gql`
  query GetStopSelectionInfo(
    $whereQuay: stops_database_quay_newest_version_bool_exp!
    $whereRoute: route_route_bool_exp!
  ) {
    stopsDb: stops_database {
      stops: stops_database_quay_newest_version(where: $whereQuay) {
        ...StopSelectionInfo
      }
    }

    routes: route_route(
      distinct_on: [label]
      where: $whereRoute
      order_by: [{ label: asc }, { priority: desc }]
    ) {
      route_id

      journeyPatterns: route_journey_patterns {
        journey_pattern_id

        stopPointsInPattern: scheduled_stop_point_in_journey_patterns {
          journey_pattern_id
          scheduled_stop_point_sequence

          stopPoint: scheduled_stop_points {
            scheduled_stop_point_id

            stop: newest_quay {
              ...StopSelectionInfo
            }
          }
        }
      }
    }
  }
`;

function whereStopOnRoute(
  { routeId, routeLabels, routePriorities }: DisplayedRouteParams,
  { observationDate }: StopSearchFilters,
): RouteRouteBoolExp | null {
  if (routeId) {
    return { route_id: { _eq: routeId } };
  }

  if (routeLabels.length) {
    return {
      label: { _in: routeLabels },
      priority: { _in: routePriorities },
      validity_start: { _lte: observationDate },
      _or: [
        { validity_end: { _is_null: true } },
        { validity_end: { _gte: observationDate } },
      ],
    };
  }

  return null;
}

const whereNoQuay: StopsDatabaseQuayNewestVersionBoolExp = {
  id: { _is_null: true },
};
const whereNoRoute: RouteRouteBoolExp = {
  route_id: { _is_null: true },
};

function getResolveStopSelectionWhereConditions(
  displayedRoute: DisplayedRouteParams,
  filters: StopSearchFilters,
  resultSelection: ResultSelection,
): GetStopSelectionInfoQueryVariables {
  const whereRoute = whereStopOnRoute(displayedRoute, filters);
  if (whereRoute) {
    return { whereQuay: whereNoQuay, whereRoute };
  }

  return {
    whereQuay: filtersAndResultSelectionToQueryVariables(
      filters,
      resultSelection,
    ),
    whereRoute: whereNoRoute,
  };
}

/**
 * By default, we should always know the NetexIds of all selected stops.
 * But on the off chance that we opened the map onto a new tab from the search
 * results, or we reload the page, or share the URL: we might have a situation
 * where the selected stops are defined as ALL-search results based on filters,
 * or PARTIAL-selection based on an exclusion list. In those cases, we do not
 * yet have a defined list of selected ids, and we need to resolve the
 * filter+selection combination into an actual id list.
 *
 * @param byResultSelection Is the Map Stop selection in list or search-selection mode
 */
function useEnsureStopsHaveBeenResolved(byResultSelection: boolean) {
  const setSelectedStops = useAppAction(setStopSelectionAction);

  const {
    state: { displayedRoute, filters, resultSelection },
  } = useMapUrlStateContext();

  // Trigger resolving of actual result selection if not known
  const selectionByInclusion = resultSelection.included.length > 0;
  const { data, error, refetch } = useGetStopSelectionInfoQuery({
    // No need to resolve the ids if they are already known, or we can copy the
    // list directly from the search-result-selection-inclusion-list.
    skip: !byResultSelection || selectionByInclusion,
    variables: getResolveStopSelectionWhereConditions(
      displayedRoute,
      filters,
      resultSelection,
    ),
  });

  // Register the results as the selection
  useEffect(() => {
    // Already known, nothing to do
    if (!byResultSelection) {
      return;
    }

    // Search selection was inclusion based -> Direct source of truth
    if (resultSelection.included.length > 0) {
      setSelectedStops({
        byResultSelection: false,
        selected: resultSelection.included.slice(),
      });
    }

    // The resolvation query is in progress (loading = true), or errored.
    if (!data) {
      return;
    }

    const idsBySearch = data.stopsDb?.stops.map((stop) => stop.netex_id);
    const idsByRoute = data.routes
      .flatMap((route) => route.journeyPatterns)
      .flatMap((pattern) => pattern.stopPointsInPattern)
      .flatMap((pointInPattern) => pointInPattern.stopPoint)
      .map((it) => it.stop?.netex_id);

    // Set the query result as selection.
    setSelectedStops({
      byResultSelection: false,
      selected: uniq([...compact(idsBySearch), ...compact(idsByRoute)]),
    });
  }, [byResultSelection, resultSelection, data, setSelectedStops]);

  return { error, refetch };
}

function compareStops(a: StopSelectionInfo, b: StopSelectionInfo): number {
  if (a.public_code && b.public_code) {
    return a.public_code.localeCompare(b.public_code);
  }

  return 0;
}

type MappedStopSelectionInfo = {
  readonly missingDataFor: ReadonlyArray<string>;
  readonly stops: ReadonlyArray<StopSelectionInfo>;
};

function mapNetexIdsToStop(
  apollo: ApolloClient,
  ids: ReadonlyArray<string>,
): MappedStopSelectionInfo {
  const missingDataFor: Array<string> = [];
  const stops: Array<StopSelectionInfo> = [];

  for (const netexId of ids) {
    // Avoid registering large amounts of observables, and the need to implement
    // clean up logic for them, and use read instead of watch. We won't get
    // updates to the data if it changed, which could technically happen if the
    // list is open, someone else updates a stop, and then the map is panned.
    const stop = apollo.readFragment<StopSelectionInfo>({
      fragment: StopSelectionInfoFragmentDoc,
      id: `stops_database_quay_newest_version:{"netex_id":"${netexId}"}`,
    });

    if (stop) {
      stops.push(stop);
    } else {
      missingDataFor.push(netexId);
    }
  }

  stops.sort(compareStops);

  return { missingDataFor, stops };
}

/**
 * Read the needed data from Apollo's cache.
 *
 * Simple solution to fetch the data would be to simply query the data normally
 * by passing the list of ids into the {@link useGetStopSelectionInfoQuery} query.
 * But doing so would cause refetch of all data when ever the list changes.
 *
 * Alternatively we could fetch the data per row in each row {@link SelectedStop}
 * component, but that would have 2 problems:
 * 1. The data would have to be fetched from the DB always at least once, even
 *    if the actual data is already in the cache, as Apollo does not know that
 *    the query would only produce that single entity as result.
 * 2. In the case where we open the search result into a new tab, we would need
 *    to perform X of those queries concurrently, without being able to combine
 *    them, which from a data perspective would be possible.
 *
 * Instead, we query the Cache directly for each individual entity and compile
 * a list of missing or partial entities, which can then be batch fetched in a
 * separate process.
 *
 * @param selectedStops Redux stop selection state.
 */
function useGetSelectedStopsInfo(selectedStops: MapStopSelection) {
  const apollo = useApolloClient();
  const [refreshId, setRefreshId] = useState<string>(() => crypto.randomUUID());

  const data: MappedStopSelectionInfo = useMemo(() => {
    if (selectedStops.byResultSelection) {
      return { missingDataFor: [], stops: [] };
    }

    return mapNetexIdsToStop(apollo, selectedStops.selected);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshId, selectedStops, apollo]);

  return {
    ...data,
    onMissingFetched: useCallback(() => setRefreshId(crypto.randomUUID()), []),
  };
}

/**
 * Initiate a "background" fetch of missing or partial rows in the selection.
 * We don't care about the result data of the query, as that getch eventually
 * red from the cache by {@link useGetSelectedStopsInfo}.
 *
 * @param missingDataFor List of ids for which we do not have cached data yet
 * @param onMissingFetched Callback to call when data has been loaded/updated
 */
function useEnsureAllStopsAreLoaded(
  missingDataFor: ReadonlyArray<string>,
  onMissingFetched: () => void,
) {
  // Trigger fetching of missing stops
  const { data, error, refetch } = useGetStopSelectionInfoQuery({
    skip: missingDataFor.length === 0,
    variables: {
      whereQuay: { netex_id: { _in: missingDataFor } },
      whereRoute: whereNoRoute,
    },
  });

  useEffect(() => {
    if (data) {
      onMissingFetched();
    }
  }, [data, onMissingFetched]);

  return { error, refetch };
}

/**
 * Make sure we know all the selected stops, and they have all been fetched.
 */
export function useSelectedStopsInfo() {
  const selectedStops = useAppSelector(selectMapStopSelection);

  const { error: resolveError, refetch: resolveRefetch } =
    useEnsureStopsHaveBeenResolved(selectedStops.byResultSelection);

  const { missingDataFor, stops, onMissingFetched } =
    useGetSelectedStopsInfo(selectedStops);
  const { error: loadError, refetch: loadRefetch } = useEnsureAllStopsAreLoaded(
    missingDataFor,
    onMissingFetched,
  );

  return {
    selectionIsKnown: !selectedStops.byResultSelection,
    allAreKnown: missingDataFor.length === 0,
    stops,
    resolveError,
    resolveRefetch,
    loadError,
    loadRefetch,
  };
}
