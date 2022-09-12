import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { getBusRoute } from '../../api/routing';
import {
  InfrastructureNetworkDirectionEnum,
  RouteRoute,
  RouteStopFieldsFragment,
  RouteValidityFragment,
  ScheduledStopPointDefaultFieldsFragment,
  ServicePatternScheduledStopPoint,
  StopWithJourneyPatternFieldsFragment,
  useGetLinksWithStopsByExternalLinkIdsAsyncQuery,
  useGetStopsAlongInfrastructureLinksAsyncQuery,
} from '../../generated/graphql';
import {
  getRouteStopLabels,
  mapRouteToInfraLinksAlongRoute,
  mapStopResultToStops,
  orderInfraLinksByExternalLinkId,
  RouteInfraLink,
} from '../../graphql';
import { buildRouteStop } from '../../redux';
import { RouteStop } from '../../redux/types';
import { areValidityPeriodsOverlapping } from '../../time';
import { Priority } from '../../types/Priority';
import {
  mapGeoJSONtoFeature,
  sortStopsOnInfraLinkComparator,
} from '../../utils';

export type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;

const GQL_GET_LINKS_WITH_STOPS_BY_EXTERNAL_LINK_IDS = gql`
  query GetLinksWithStopsByExternalLinkIds($externalLinkIds: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $externalLinkIds } }
    ) {
      ...route_infra_link_fields
    }
  }
`;

/**
 * Get RouteStops for stops along route geometry
 * @param stops List of stops along route geometry
 * @param removedStopLabels List of stop labels that have been removed from the route
 * @param routeId Id of the route which has this stop along it's route geometry
 * @returns List of RouteStops
 */
export const getRouteStops = <
  TStop extends StopWithJourneyPatternFieldsFragment,
>(
  stops: TStop[],
  removedStopLabels?: string[],
  routeId?: UUID,
): RouteStop[] => {
  return stops.map((item) => {
    const belongsToRoute = !removedStopLabels?.includes(item.label);

    return buildRouteStop(item, belongsToRoute, routeId);
  });
};

export const mapRouteStopsToStopLabels = (routeStops: RouteStop[]) =>
  routeStops
    .filter((item) => item.belongsToJourneyPattern)
    .map((item) => item.label);

/**
 * Verifies that stop is on the correct side of the road for the route
 * @param stop stop of the route
 * @param isTraversalForwards the traversal direction of the route along the link
 */
const isStopTraversalCompatible = (
  stop: ScheduledStopPointDefaultFieldsFragment,
  isTraversalForwards: boolean,
) =>
  stop.direction === InfrastructureNetworkDirectionEnum.Bidirectional ||
  (isTraversalForwards &&
    stop.direction === InfrastructureNetworkDirectionEnum.Forward) ||
  (!isTraversalForwards &&
    stop.direction === InfrastructureNetworkDirectionEnum.Backward);

/**
 * Verifies that the stop's validity period is overlapping with its route's validity period
 * @param stop stop of the route
 * @param routeValidity the validity period of the route
 */
const isStopValidDuringRouteValidity = (
  stop: ScheduledStopPointDefaultFieldsFragment,
  routeValidity: RouteValidityFragment,
) => areValidityPeriodsOverlapping(routeValidity, stop);

/**
 * Checks whether a stop instance is along a route's geometry and its traversal is compatible
 * @param stop stop instance
 * @param routeInfraLinks all the infra links along the route
 */
const isStopAlongInfraLinks = (
  stop: ScheduledStopPointDefaultFieldsFragment,
  routeInfraLinks: RouteInfraLink[],
) => {
  // first checking if the stop is beside of any of the route's infra links
  const infraLink = routeInfraLinks.find(
    (link) =>
      link.infrastructure_link_id === stop.located_on_infrastructure_link_id,
  );
  if (!infraLink) {
    return false;
  }

  // second, check if the stop's direction is compatible with the route's traversal direction
  return isStopTraversalCompatible(stop, infraLink.is_traversal_forwards);
};

/**
 * Validate all the (same label) instances of a stop.
 * We don't allow stops that may have active instances outside of the route geometry
 * @param stop a single stop instance
 * @param routeValidity the validity period of the route
 * @param routeInfraLinks all the infra links along the route
 */
const validateStopInstancesAlongGeometry = (
  stop: RouteStopFieldsFragment,
  routeValidity: RouteValidityFragment,
  routeInfraLinks: RouteInfraLink[],
) => {
  // We always allow draft stops along routes, no integrity checks are done
  if (stop.priority === Priority.Draft) {
    return true;
  }

  const stopInstances = stop.other_label_instances;
  return stopInstances.every((instance) => {
    // For the stop instance itself, no integrity checks are done
    if (instance.scheduled_stop_point_id === stop.scheduled_stop_point_id) {
      return true;
    }

    // For the stop's other instances that are drafts, no integrity checks are done
    if (instance.priority === Priority.Draft) {
      return true;
    }

    // For the stop's other instances that are not valid during the route's validity period,
    // no integrity checks are done as they cannot belong to the route
    if (!areValidityPeriodsOverlapping(instance, routeValidity)) {
      return true;
    }

    // Checking if the other instance is also along the route and is compatible with the traversal direction
    return isStopAlongInfraLinks(stop, routeInfraLinks);
  });
};

/**
 * Removes all duplicate labeled consecutive stops from the list
 * This is used for example removing different versions of stops from the
 * journey pattern list where only the labels are shown
 */
export const filterDistinctConsecutiveRouteStops = <
  TStop extends Pick<ServicePatternScheduledStopPoint, 'label'>,
>(
  stops: TStop[],
) => stops.filter((stop, index) => stops[index - 1]?.label !== stop.label);

/**
 * Finds all the stops along a route's geometry that are eligible to be part of the journey pattern
 * - only keeps stops that are on the correct side of the road
 * - only keeps stops that are compatible with the route's vehicle mode
 * - only keeps stops that are valid during the route's validity period
 * - for draft routes, no journey pattern integrity checks are done
 * - for non-draft routes, we verify that all stops' other instances are also along the same route
 * We don't check/filter however that:
 * - there are consecutive duplicate instances of the same stop along the route geometry (e.g. A-B1-B2-C)
 *   -> these could be filtered out in the lists. However probably they should all be marked somehow on the map
 * - there are stops that have non-neighboring instances along the route geometry (e.g. A-B1-C-B2-D)
 *   -> this journey pattern would actually be valid if "C" was excluded from it. So either "B" or
 *      "C" stops should be excluded from the journey pattern, but the choice is up to the user
 * - we don't check whether the result stops are actually showing up on the map.
 *   -> the stops visible on the map are controlled by the user and should not affect the list of eligible stops
 * - we don't check whether the line's primary vehicle mode is compatible with the are the vehicle modes compatible
 *   -> with even a tiny bit faulty data this might cause false negatives. It should be enough that the route geometry
 *      returned by map-matching is compatible with the line's vehicle mode
 * @param infraLinksWithStops: list of infra links (in order) with the stops on them
 * @param routeMetadata: metadata about the edited route (e.g. priority, validity period)
 */
export const extractJourneyPatternCandidateStops = (
  infraLinksWithStops: RouteInfraLink[],
  routeMetadata: RouteValidityFragment,
) => {
  // getting the (ordered) list of all the stops that are along the infra links,
  // prefiltered by route compatibility
  const filteredStops = infraLinksWithStops.flatMap((infraLinkWithStops) => {
    const isTraversalForwards = infraLinkWithStops.is_traversal_forwards;
    const linkStops =
      infraLinkWithStops.scheduled_stop_points_located_on_infrastructure_link;

    return linkStops
      .filter(
        (stop) =>
          isStopTraversalCompatible(stop, isTraversalForwards) &&
          isStopValidDuringRouteValidity(stop, routeMetadata),
      )
      .sort(sortStopsOnInfraLinkComparator(isTraversalForwards));
  });

  // for draft routes, we don't check the integrity of the journey pattern
  // e.g. are all the stop instances along the route and in the correct order
  if (routeMetadata.priority === Priority.Draft) {
    return filteredStops;
  }

  // checking the integrity of the journey pattern
  const filteredValidatedStops = filteredStops.filter((stop) =>
    validateStopInstancesAlongGeometry(
      stop,
      routeMetadata,
      infraLinksWithStops,
    ),
  );

  return filteredValidatedStops;
};

export const mapInfraLinksToFeature = (
  infraLinks: RouteInfraLink[],
): LineStringFeature => {
  const coordinates: GeoJSON.Position[] = infraLinks.flatMap((link, index) => {
    const isFirst = index === 0;
    const linkCoordinates = link.shape.coordinates;

    // Order coordinates properly

    const shouldReverseCoordinates =
      linkCoordinates.length && !link.is_traversal_forwards;

    // TODO: Could be optimized since only first and last coordinates are being used
    const featureCoordinates = shouldReverseCoordinates
      ? [...linkCoordinates].reverse()
      : linkCoordinates;

    // To simplify the path drawn,
    // remove points in the middle of the infrastructure link
    const firstPoint = featureCoordinates[0];
    const lastPoint = featureCoordinates[featureCoordinates.length - 1];

    const pointsToDraw = isFirst ? [firstPoint, lastPoint] : [lastPoint];

    // Remove z-coordinate
    return pointsToDraw.map(
      (coordinate: number[]) => coordinate.slice(0, 2) as GeoJSON.Position,
    );
  });

  return mapGeoJSONtoFeature({ type: 'LineString', coordinates });
};

export const getOldRouteGeometryVariables = (
  stateStops: RouteStop[],
  stateInfraLinks: RouteInfraLink[] | undefined,
  baseRoute?: RouteRoute,
) => {
  const previouslyEditedRouteStops = mapRouteStopsToStopLabels(stateStops);
  const previouslyEditedRouteInfrastructureLinks = stateInfraLinks || [];

  // If we are editing existing route and it has not been edited yet,
  // extract and return stops and infra links from the original route
  if (
    (!previouslyEditedRouteStops.length ||
      !previouslyEditedRouteInfrastructureLinks.length) &&
    baseRoute
  ) {
    return {
      oldStopLabels: getRouteStopLabels(baseRoute),
      oldInfraLinks: mapRouteToInfraLinksAlongRoute(baseRoute),
    };
  }

  // If route has been edited, return edited route's stops and infra links
  return {
    oldStopLabels: previouslyEditedRouteStops,
    oldInfraLinks: previouslyEditedRouteInfrastructureLinks,
  };
};

export const useExtractRouteFromFeature = () => {
  const [fetchLinksWithStopsByExternalLinkIds] =
    useGetLinksWithStopsByExternalLinkIdsAsyncQuery();
  const [fetchStopsAlongInfrastructureLinks] =
    useGetStopsAlongInfrastructureLinksAsyncQuery();

  const fetchInfraLinksWithStopsByExternalIds = useCallback(
    async (externalLinkIds: string[]) => {
      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse =
        await fetchLinksWithStopsByExternalLinkIds({
          externalLinkIds,
        });
      const unorderedInfraLinksWithStops =
        infraLinksWithStopsResponse.data
          .infrastructure_network_infrastructure_link;
      if (!unorderedInfraLinksWithStops) {
        throw new Error("could not fetch route's infra links");
      }

      // Order the infra links to match the order of the route returned by map-matching
      const orderedInfraLinksWithStops = orderInfraLinksByExternalLinkId(
        unorderedInfraLinksWithStops,
        externalLinkIds,
      );

      return orderedInfraLinksWithStops;
    },
    [fetchLinksWithStopsByExternalLinkIds],
  );

  /**
   * Gets the infra links and the nearby stops that are along a line geometry
   * @param coordinates the list of coordinates in order along the line geometry. E.g. coordinates
   * of the snapping line.
   */
  const getInfraLinksWithStopsForGeometry = useCallback(
    async (geometry: GeoJSON.LineString) => {
      // Do map-matching for the given geometry
      const mapMatchingResult = await getBusRoute(geometry.coordinates);
      const matchedRoute = mapMatchingResult.routes[0];

      // Collect all the infra links' external ids, in order
      const externalLinkIds = matchedRoute?.paths?.map(
        (item) => item.externalLinkRef.externalLinkId,
      );

      // Retrieve the infra links from the external link ids returned by map-matching.
      // This returns the infra links in order
      const orderedInfraLinksWithStops =
        await fetchInfraLinksWithStopsByExternalIds(externalLinkIds);

      // Enrich the infra link with some routing data
      const infraLinksWithStops: RouteInfraLink[] =
        orderedInfraLinksWithStops.map((item, index) => ({
          ...item,
          is_traversal_forwards:
            mapMatchingResult.routes[0]?.paths[index]?.isTraversalForwards,
        }));

      return {
        infraLinksWithStops,
        matchedGeometry: matchedRoute?.geometry,
      };
    },
    [fetchInfraLinksWithStopsByExternalIds],
  );

  const getRemovedStopLabels = useCallback(
    async (infrastructureLinkIds: UUID[], currentStopLabels: string[]) => {
      const stopsResult = await fetchStopsAlongInfrastructureLinks({
        infrastructure_link_ids: infrastructureLinkIds,
      });

      return mapStopResultToStops(stopsResult)
        .map((item) => item.label)
        .filter((stop) => !currentStopLabels.includes(stop));
    },

    [fetchStopsAlongInfrastructureLinks],
  );

  return {
    fetchInfraLinksWithStopsByExternalIds,
    getInfraLinksWithStopsForGeometry,
    getRemovedStopLabels,
  };
};
