import { gql } from '@apollo/client';
import {
  RouteMetadataFragment,
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  useGetRouteWithInfrastructureLinksWithStopsQuery,
} from '../../../../generated/graphql';
import {
  getRouteStopLabels,
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
} from '../../../../graphql';
import { useAppSelector } from '../../../../hooks';
import {
  EditedRouteData,
  selectEditedRouteData,
  selectHasChangesInProgress,
} from '../../../../redux';
import { mapRouteFormToInput } from './useEditRouteMetadata';
import { extractJourneyPatternCandidateStops } from './useExtractRouteFromFeature';

const GQL_ROUTE_METADATA = gql`
  fragment route_metadata on route_route {
    name_i18n
    label
    priority
    validity_start
    validity_end
    direction
    variant
  }
`;

const GQL_ROUTES_WITH_INFRASTRUCTURE_LINKS_WITH_STOPS = gql`
  fragment route_with_infrastructure_links_with_stops on route_route {
    ...route_all_fields
    route_line {
      ...line_all_fields
    }
    infrastructure_links_along_route {
      ...infra_link_along_route_with_stops
    }
  }
`;

const GQL_ROUTES_WITH_INFRASTRUCTURE_LINKS_WITH_STOPS_AND_JPS = gql`
  fragment route_with_infrastructure_links_with_stops_and_jps on route_route {
    ...route_with_infrastructure_links_with_stops
    ...route_with_journey_pattern_stops
  }
`;

const GQL_INFRA_LINK_ALONG_ROUTE_WITH_STOPS = gql`
  fragment infra_link_along_route_with_stops on route_infrastructure_link_along_route {
    route_id
    infrastructure_link_sequence
    infrastructure_link_id
    infrastructure_link {
      ...infra_link_matching_fields
      external_link_source
      scheduled_stop_points_located_on_infrastructure_link {
        ...route_stop_fields
      }
    }
    is_traversal_forwards
  }
`;

const GQL_GET_ROUTE_WITH_INFRASTRUCTURE_LINKS_WITH_STOPS = gql`
  query GetRouteWithInfrastructureLinksWithStops($route_id: uuid!) {
    route_route_by_pk(route_id: $route_id) {
      ...route_with_infrastructure_links_with_stops_and_jps
    }
  }
`;

const getRouteInfoFromRoute = (
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
) => {
  const infraLinksWithStops = mapInfrastructureLinksAlongRouteToRouteInfraLinks(
    route.infrastructure_links_along_route,
  );

  const stopsEligibleForJourneyPattern = extractJourneyPatternCandidateStops(
    infraLinksWithStops,
    route,
  );

  const includedStopLabels = getRouteStopLabels(route);

  return {
    routeMetadata: route,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
  };
};

const getRouteInfoFromState = (editedRouteData: EditedRouteData) => {
  return {
    routeMetadata: editedRouteData.metaData
      ? mapRouteFormToInput(editedRouteData.metaData)
      : undefined,
    stopsEligibleForJourneyPattern:
      editedRouteData.stopsEligibleForJourneyPattern,
    includedStopLabels: editedRouteData.includedStopLabels,
  };
};

export const belongsToJourneyPattern = (
  includedStopLabels: ReadonlyArray<string>,
  stopLabel: string,
) => {
  return includedStopLabels.includes(stopLabel);
};

type RouteInfo = {
  readonly routeMetadata: RouteMetadataFragment | undefined;
  readonly stopsEligibleForJourneyPattern: ReadonlyArray<RouteStopFieldsFragment>;
  readonly includedStopLabels: ReadonlyArray<string>;
};

/**
 * Hook for getting route's metadata and eligible + included stops in the journey pattern.
 * If route is being created or edited, we use data from redux store.
 * If route is just being viewed, data is fetched from backend.
 *
 * It is not ideal to have different sources of data for different use cases,
 * but e.g. getting all route data to redux for every use case and using it as a source in every case
 * would create its own problems (e.g. caching) so we are going with this hybrid model for now.
 */
export const useRouteInfo = (routeId: UUID | undefined): RouteInfo => {
  const editedRouteData = useAppSelector(selectEditedRouteData);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  // Get route data
  const routesResult = useGetRouteWithInfrastructureLinksWithStopsQuery({
    /**
     * Fetching route data when it is e.g. selected on the map.
     * No need to fetch the data when it is being edited as it already exists in the redux store
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { route_id: routeId! },
    skip: !routeId && !routeEditingInProgress,
  });
  const fetchedRoute = routesResult.data?.route_route_by_pk ?? undefined;

  if (routeEditingInProgress) {
    /**
     * If editing in progress, get eligible and included stops from redux store
     */
    return getRouteInfoFromState(editedRouteData);
  }

  if (fetchedRoute) {
    /**
     * If just viewing a route and route data has been fetched,
     * extract eligible stops from infrastructure links
     * and included stops from route journey pattern
     */
    return getRouteInfoFromRoute(fetchedRoute);
  }

  return {
    routeMetadata: fetchedRoute,
    stopsEligibleForJourneyPattern: [],
    includedStopLabels: [],
  };
};
