import { gql } from '@apollo/client';
import length from '@turf/length';
import { Feature, LineString, Point } from 'geojson';
import isEqual from 'lodash/isEqual';
import { useCallback } from 'react';
import { getBusRoute } from '../../api/routing';
import {
  InfraLinkMatchingFieldsFragment,
  InfrastructureLinkAllFieldsFragment,
  InfrastructureLinkWithStopsFragment,
  InfrastructureNetworkDirectionEnum,
  RouteStopFieldsFragment,
  RouteValidityFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  ScheduledStopPointDefaultFieldsFragment,
  StopWithJourneyPatternFieldsFragment,
  useGetLinksWithStopsByExternalLinkIdsLazyQuery,
  useGetStopsAlongInfrastructureLinksLazyQuery,
} from '../../generated/graphql';
import {
  RouteInfraLink,
  getRouteStopLabels,
  mapRouteToInfraLinksAlongRoute,
  mapStopResultToStops,
  orderInfraLinksByExternalLinkId,
} from '../../graphql';
import { areValidityPeriodsOverlapping } from '../../time';
import { Priority } from '../../types/enums';
import {
  mapGeoJSONtoFeature,
  relativeAlong,
  sortStopsOnInfraLinkComparator,
} from '../../utils';

export type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;

// Minimun length (meters) for infrastructure links,
// from which feature points are picked from
const MIN_INFRA_LINK_POINT_PICK_LENGTH = 15;

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
export const getStopLabelsIncludedInRoute = <
  TStop extends StopWithJourneyPatternFieldsFragment,
>(
  stops: ReadonlyArray<TStop>,
  removedStopLabels?: ReadonlyArray<string>,
): string[] =>
  stops
    .filter((item) => !removedStopLabels?.includes(item.label))
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
  routeInfraLinks: ReadonlyArray<
    RouteInfraLink<InfraLinkMatchingFieldsFragment>
  >,
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
  routeInfraLinks: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >,
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
  infraLinksWithStops: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkWithStopsFragment>
  >,
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

/**
 * Maps Infrastructure Link to GeoJSON Feature
 * @param link Infrastructure link
 * @returns GeoJSON Feature
 */
const mapInfraLinkToFeature = (
  link: RouteInfraLink<InfrastructureLinkAllFieldsFragment>,
) => {
  const { shape, is_traversal_forwards: isTraversalForwards } = link;

  // Build feature out of infrastructure link geometry
  const shouldReverseGeometry =
    !!shape.coordinates.length && !isTraversalForwards;

  const linkCoordinates = shouldReverseGeometry
    ? shape.coordinates.toReversed()
    : shape.coordinates;

  return mapGeoJSONtoFeature({
    ...shape,
    coordinates: linkCoordinates,
  });
};

type SnapPointCalculationParams = {
  readonly isFirstLink: boolean;
  readonly isLastLink: boolean;
  readonly isLoopLink: boolean;
  readonly isBetweenLink: boolean;
  readonly isOnlyLink: boolean;
  readonly isBidirectional: boolean;
  readonly isLinkLengthValid: boolean;
};

const getSnapPointCalculateParamsForInfraLink = (
  linkFeature: GeoJSON.Feature<LineString>,
  direction: InfrastructureNetworkDirectionEnum,
  index: number,
  linkCount: number,
): SnapPointCalculationParams => {
  const { coordinates } = linkFeature.geometry;
  const featureLength = length(linkFeature, { units: 'meters' });

  // Helper constants for deciding which points to use
  const isFirstLink = index === 0;
  const isLastLink = index === linkCount - 1;
  const isLoopLink = isEqual(
    coordinates[0],
    coordinates[coordinates.length - 1],
  );
  const isBetweenLink = !isFirstLink && !isLastLink;
  const isOnlyLink = isFirstLink && isLastLink;
  const isBidirectional =
    direction === InfrastructureNetworkDirectionEnum.Bidirectional;
  const isLinkLengthValid = featureLength > MIN_INFRA_LINK_POINT_PICK_LENGTH;

  return {
    isFirstLink,
    isLastLink,
    isLoopLink,
    isBetweenLink,
    isOnlyLink,
    isBidirectional,
    isLinkLengthValid,
  };
};

/**
 * Returns relative distances along the infrastructure link for edited route snap points
 * @returns An array of floats which describe the percentage of distance along the infra link geometry
 * to travel to reach the snap point location
 */
const getRelativeSnapPointDistancesAlongLink = ({
  isFirstLink,
  isLastLink,
  isLoopLink,
  isBetweenLink,
  isOnlyLink,
  isBidirectional,
  isLinkLengthValid,
}: SnapPointCalculationParams) => {
  if (isLoopLink) {
    if (isBidirectional || isOnlyLink) {
      // If closed-loop link is bidirectional or only link along route, add two points at fractional
      // locations (33%, 66%) of the link geometry.
      return [1 / 3, 2 / 3];
    }
    return [0.5];
  }
  if (isOnlyLink) {
    // If this link is the only link, return first and last points.
    return [0, 1];
  }
  if (isFirstLink) {
    // If link is first of route's infrastructure links, add link's starting point and center point.
    // Center point is needed to avoid skipping a link, e.g. case where first link is open loop
    return [0, 0.5];
  }
  if (isBetweenLink && isLinkLengthValid) {
    // If link is in between route's other infrastructure links (is not first or last link),
    // add link's center point (if infrastructure link is long enough).
    return [0.5];
  }
  if (isLastLink) {
    // If link is last of route's infrastructure links, add link's center point and endpoint.
    // Center point is needed to avoid skipping a link, e.g. case where last link is open loop
    return [0.5, 1];
  }

  // Otherwise don't add any point on the link to the snap points
  return [];
};

export const mapInfraLinksToFeature = (
  infraLinks: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >,
): LineStringFeature => {
  const coordinates: GeoJSON.Position[] = infraLinks.flatMap((link, index) => {
    const linkFeature = mapInfraLinkToFeature(link);

    // Distances in percentages how far along the infrastructure link the desired point is located
    const relativeDistancesAlongLink = getRelativeSnapPointDistancesAlongLink(
      getSnapPointCalculateParamsForInfraLink(
        linkFeature,
        link.direction,
        index,
        infraLinks.length,
      ),
    );

    return (
      relativeDistancesAlongLink
        // Map relative distance to point along infrastructure link
        .map((relativeDistance) => relativeAlong(linkFeature, relativeDistance))
        // Remove z-coordinate
        .map(
          (point: Feature<Point>) =>
            point.geometry.coordinates.slice(0, 2) as GeoJSON.Position,
        )
    );
  });

  return mapGeoJSONtoFeature({ type: 'LineString', coordinates });
};

export const getOldRouteGeometryVariables = (
  previouslyEditedStopLabels: ReadonlyArray<string>,
  stateInfraLinks:
    | RouteInfraLink<InfrastructureLinkAllFieldsFragment>[]
    | undefined,
  baseRoute?: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
) => {
  const previouslyEditedRouteInfrastructureLinks = stateInfraLinks ?? [];

  // If we are editing existing route and it has not been edited yet,
  // extract and return stops and infra links from the original route
  if (
    (!previouslyEditedStopLabels.length ||
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
    oldStopLabels: previouslyEditedStopLabels,
    oldInfraLinks: previouslyEditedRouteInfrastructureLinks,
  };
};

export const useExtractRouteFromFeature = () => {
  const [fetchLinksWithStopsByExternalLinkIds] =
    useGetLinksWithStopsByExternalLinkIdsLazyQuery();
  const [fetchStopsAlongInfrastructureLinks] =
    useGetStopsAlongInfrastructureLinksLazyQuery();

  const fetchInfraLinksWithStopsByExternalIds = useCallback(
    async (externalLinkIds: ReadonlyArray<string>) => {
      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse =
        await fetchLinksWithStopsByExternalLinkIds({
          variables: {
            externalLinkIds: externalLinkIds as Array<string>,
          },
        });
      const unorderedInfraLinksWithStops =
        infraLinksWithStopsResponse.data
          ?.infrastructure_network_infrastructure_link;
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
      const infraLinksWithStops = orderedInfraLinksWithStops.map(
        (item, index) => ({
          ...item,
          is_traversal_forwards:
            mapMatchingResult.routes[0]?.paths[index]?.isTraversalForwards,
        }),
      );

      return {
        infraLinksWithStops,
        matchedGeometry: matchedRoute?.geometry,
      };
    },
    [fetchInfraLinksWithStopsByExternalIds],
  );

  const getRemovedStopLabels = useCallback(
    async (
      infrastructureLinkIds: ReadonlyArray<UUID>,
      currentStopLabels: ReadonlyArray<string>,
    ) => {
      const stopsResult = await fetchStopsAlongInfrastructureLinks({
        variables: {
          infrastructure_link_ids: infrastructureLinkIds as Array<string>,
        },
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
