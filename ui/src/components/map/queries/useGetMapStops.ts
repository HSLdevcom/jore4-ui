import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  MapStopMinimalDetailsFragment,
  StopsDatabaseQuayNewestVersionBoolExp,
  useGetMapStopsQuery,
} from '../../../generated/graphql';
import { Operation } from '../../../redux';
import { Viewport } from '../../../redux/types';
import { parseDate } from '../../../time';
import { Priority } from '../../../types/enums';
import { StopPlaceState } from '../../../types/stop-registry';
import { parseStopRegistryTransportModeJsonArray } from '../../../utils';
import { useMapDataLayerSimpleQueryLoader } from '../../common/hooks/useLoader';
import { filtersAndResultSelectionToQueryVariables } from '../../stop-registry/search/by-stop/filtersToQueryVariables';
import { mapCompactOrNull } from '../../stop-registry/utils';
import { MapStop } from '../types';
import { buildWithinViewportGqlGeometryFilter } from '../utils/buildWithinViewportGqlGeometryFilter';
import { useMapUrlStateContext } from '../utils/mapUrlState';
import { hasSearchFilters } from '../utils/useIsInSearchResultMode';

const GQL_GET_MAP_STOPS = gql`
  query GetMapStops($where: stops_database_quay_newest_version_bool_exp) {
    stops_database {
      stops: stops_database_quay_newest_version(where: $where) {
        ...MapStopMinimalDetails
      }
    }
  }

  fragment MapStopMinimalDetails on stops_database_quay_newest_version {
    id
    netex_id
    stop_place_netex_id

    label: public_code

    validity_start
    validity_end
    priority
    stop_state

    centroid
    functional_area

    transport_modes
    active_transport_modes
    trunk_line_stop
    speed_tram_stop
  }
`;

function viewportToWhere(
  viewport: Viewport,
): StopsDatabaseQuayNewestVersionBoolExp {
  return { centroid: buildWithinViewportGqlGeometryFilter(viewport) };
}

function whereSelectedTerminal(
  terminalId: string | null | undefined,
): StopsDatabaseQuayNewestVersionBoolExp | null {
  if (!terminalId) {
    return null;
  }

  return { stopPlaceParent: { parent: { netex_id: { _eq: terminalId } } } };
}

function whereSelectedStopArea(
  stopAreaId: string | null | undefined,
): StopsDatabaseQuayNewestVersionBoolExp | null {
  if (!stopAreaId) {
    return null;
  }

  return { stop_place_netex_id: { _eq: stopAreaId } };
}

function parseValidNumber(value: unknown): number | null {
  const parsed = Number(value);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return null;
}

function mapRawStopToMapStop(
  rawStop: MapStopMinimalDetailsFragment | null,
): MapStop | null {
  if (
    !rawStop?.label ||
    rawStop.centroid?.type !== 'Point' ||
    !rawStop.netex_id ||
    !rawStop.stop_place_netex_id
  ) {
    return null;
  }

  return {
    label: rawStop.label,
    location: rawStop.centroid,
    netex_id: rawStop.netex_id,
    stop_place_netex_id: rawStop.stop_place_netex_id,
    priority: Number(rawStop.priority) as Priority,
    validity_start: parseDate(rawStop.validity_start),
    validity_end: parseDate(rawStop.validity_end),
    functional_area: parseValidNumber(rawStop.functional_area),
    stop_state: rawStop.stop_state as StopPlaceState,
    transport_modes: parseStopRegistryTransportModeJsonArray(
      rawStop.transport_modes,
    ),
    active_transport_modes: parseStopRegistryTransportModeJsonArray(
      rawStop.active_transport_modes,
    ),
    trunk_line_stop: !!rawStop.trunk_line_stop,
    speed_tram_stop: !!rawStop.speed_tram_stop,
  };
}

type GetMapStopsOptions = {
  readonly selectedStopAreaId: string | null | undefined;
  readonly selectedTerminalId: string | null | undefined;
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapStops({
  selectedStopAreaId,
  selectedTerminalId,
  skipFetching,
  viewport,
}: GetMapStopsOptions) {
  const {
    state: { filters, resultSelection },
  } = useMapUrlStateContext();
  const isInSearchMode = hasSearchFilters(filters);

  const whereInViewPort = viewportToWhere(viewport);
  const stopsResult = useGetMapStopsQuery({
    variables: {
      where: isInSearchMode
        ? filtersAndResultSelectionToQueryVariables(
            filters,
            resultSelection,
            whereInViewPort,
          )
        : {
            _or: compact([
              whereInViewPort,
              whereSelectedStopArea(selectedStopAreaId),
              whereSelectedTerminal(selectedTerminalId),
            ]),
          },
    },
    skip: skipFetching,
  });

  const setFetchStopsLoadingState = useMapDataLayerSimpleQueryLoader(
    Operation.FetchStops,
    stopsResult,
    skipFetching,
  );

  const { data, previousData, loading, ...rest } = stopsResult;

  const rawStops = loading
    ? previousData?.stops_database?.stops
    : data?.stops_database?.stops;

  const stops: ReadonlyArray<MapStop> = useMemo(
    () => mapCompactOrNull(rawStops, mapRawStopToMapStop) ?? [],
    [rawStops],
  );

  return { ...rest, loading, stops, setFetchStopsLoadingState };
}
