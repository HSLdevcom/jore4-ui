import { gql } from '@apollo/client';
import flow from 'lodash/flow';
import { DateTime } from 'luxon';
import {
  RouteMetadataFragment,
  RouteStopFieldsFragment,
  ScheduledStopPointDefaultFieldsFragment,
  useGetLinksWithStopsByRouteIdQuery,
  useGetRouteWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import {
  getRouteStopLabels,
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
  RouteInfraLink,
} from '../../graphql';
import { selectHasChangesInProgress, selectMapEditor } from '../../redux';
import { useAppSelector } from '../redux';
import { filterHighestPriorityCurrentStops } from '../stops';
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
  }
`;

const GQL_INFRA_LINK_ALONG_ROUTE_WITH_STOPS = gql`
  fragment infra_link_along_route_with_stops on route_infrastructure_link_along_route {
    route_id
    infrastructure_link_sequence
    infrastructure_link_id
    infrastructure_link {
      ...infra_link_matching_fields
      scheduled_stop_points_located_on_infrastructure_link {
        ...route_stop_fields
      }
    }
    is_traversal_forwards
  }
`;

const GQL_GET_LINKS_WITH_STOPS_BY_ROUTE_ID = gql`
  query GetLinksWithStopsByRouteId($routeId: uuid!) {
    route_infrastructure_link_along_route(
      where: { route_id: { _eq: $routeId } }
    ) {
      ...infra_link_along_route_with_stops
    }
  }
`;

const mapInfraLinksAlongRouteWithStopsResultToRouteInfraLinks = flow(
  (result) => result.data?.route_infrastructure_link_along_route,
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
);

/**
 * Gets an array of stops that can be added to a route. This array might contain multiple different
 * version instances of the same stop. Returns an array of stop instances
 * that can be added to the route, removing any lower priority instances.
 *
 * What is important here is that
 * 1. the order of stops is preserved (order in which they are along the route geometry)
 * 2. we do not remove duplicate stops from the array, because same stop can be along the route
 * geometry multiple times (e.g. loop in the geometry)
 */
export const getHighestPriorityStopsEligibleForJourneyPattern = <
  TStop extends ScheduledStopPointDefaultFieldsFragment,
>(
  stopsEligibleForJourneyPattern: TStop[],
  observationDate: DateTime,
  allowDrafts = false,
) => {
  const highestPriotityStops = filterHighestPriorityCurrentStops(
    stopsEligibleForJourneyPattern,
    observationDate,
    allowDrafts,
  );

  // Filter out any stop instances that are not highest priority at selected observation date
  return stopsEligibleForJourneyPattern.filter((eligibleStop) =>
    highestPriotityStops?.find(
      (stop) =>
        eligibleStop.scheduled_stop_point_id === stop.scheduled_stop_point_id,
    ),
  );
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
export const useRouteInfo = (
  routeId: UUID | undefined,
  observationDate: DateTime,
  allowDraftStops = false,
) => {
  const { editedRouteData, creatingNewRoute } = useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  // Get route data
  const routesResult = useGetRouteWithInfrastructureLinksQuery({
    /**
     * Fetching route data when it is e.g. selected on the map.
     * No need to fetch the data when it is being edited as it already exists in the redux store
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { route_id: routeId! },
    skip: !routeId && !routeEditingInProgress,
  });
  const fetchedRoute = routesResult.data?.route_route?.[0];

  let routeMetadata: RouteMetadataFragment | undefined = fetchedRoute;

  // If creating new route, get route metadata from redux
  if (creatingNewRoute && editedRouteData.metaData) {
    routeMetadata = mapRouteFormToInput(editedRouteData.metaData);
  }

  const infraLinksWithStopsResult = useGetLinksWithStopsByRouteIdQuery({
    // If routeId is undefined, we are creating a new route and this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: routeId! },
    /**
     * If we are getting edited or created route infra links,
     * do not fetch them as we should get them from redux
     */
    skip: routeId === editedRouteData.id || creatingNewRoute,
  });

  const infraLinksWithStops: RouteInfraLink[] =
    mapInfraLinksAlongRouteWithStopsResultToRouteInfraLinks(
      infraLinksWithStopsResult,
    );

  let stopsEligibleForJourneyPattern: RouteStopFieldsFragment[] = [];
  let includedStopLabels: string[] = [];

  if (routeEditingInProgress) {
    /**
     * If editing in progress, get eligible and included stops from redux store
     */
    stopsEligibleForJourneyPattern =
      editedRouteData.stopsEligibleForJourneyPattern;

    includedStopLabels = editedRouteData.includedStopLabels;
  } else if (fetchedRoute) {
    /**
     * If just viewing a route and route data has been fetched,
     * extract eligible stops from infrastructure links
     * and included stops from route journey pattern
     */
    stopsEligibleForJourneyPattern = extractJourneyPatternCandidateStops(
      infraLinksWithStops,
      fetchedRoute,
    );

    includedStopLabels = getRouteStopLabels(fetchedRoute);
  }

  const highestPriorityStopsEligibleForJourneyPattern =
    getHighestPriorityStopsEligibleForJourneyPattern(
      stopsEligibleForJourneyPattern,
      observationDate,
      allowDraftStops,
    );

  const belongsToJourneyPattern = (stop: RouteStopFieldsFragment) => {
    return !!includedStopLabels.includes(stop.label);
  };

  return {
    routeMetadata,
    stopsEligibleForJourneyPattern,
    highestPriorityStopsEligibleForJourneyPattern,
    includedStopLabels,
    belongsToJourneyPattern,
  };
};
