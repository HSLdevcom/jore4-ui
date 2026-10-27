import flip from 'lodash/flip';
import {
  InfraLinkAlongRouteWithStopsFragment,
  InfraLinkMatchingFieldsFragment,
  InfrastructureLinkAllFieldsFragment,
  InfrastructureNetworkDirectionEnum,
  RouteStopFieldsFragment,
  RouteValidityFragment,
  ScheduledStopPointAllFieldsFragment,
  ScheduledStopPointDefaultFieldsFragment,
} from '../../../generated/graphql';
import { areValidityPeriodsOverlapping } from '../../../time';
import { RouteInfraLink } from '../../../types';
import { Priority } from '../../../types/enums';
import { StopPlaceState } from '../../../types/stop-registry';
import { Comparator } from '../../../utils';

/**
 * Verifies that stop is on the correct side of the road for the route
 * @param stop stop of the route
 * @param isTraversalForwards the traversal direction of the route along the link
 */
function isStopTraversalCompatible(
  stop: ScheduledStopPointDefaultFieldsFragment,
  isTraversalForwards: boolean,
) {
  return (
    stop.direction === InfrastructureNetworkDirectionEnum.Bidirectional ||
    (isTraversalForwards &&
      stop.direction === InfrastructureNetworkDirectionEnum.Forward) ||
    (!isTraversalForwards &&
      stop.direction === InfrastructureNetworkDirectionEnum.Backward)
  );
}

/**
 * Verifies that the stop's validity period is overlapping with its route's validity period
 * @param stop stop of the route
 * @param routeValidity the validity period of the route
 */
function isStopValidDuringRouteValidity(
  stop: ScheduledStopPointDefaultFieldsFragment,
  routeValidity: RouteValidityFragment,
) {
  return areValidityPeriodsOverlapping(routeValidity, stop);
}

function isStopActive(stop: RouteStopFieldsFragment) {
  return (
    !stop.newest_quay?.stop_state ||
    stop.newest_quay.stop_state === StopPlaceState.InOperation
  );
}

/**
 * Checks whether a stop instance is along a route's geometry and its traversal is compatible
 * @param stop stop instance
 * @param routeInfraLinks all the infra links along the route
 */
function isStopAlongInfraLinks(
  stop: ScheduledStopPointDefaultFieldsFragment,
  routeInfraLinks: ReadonlyArray<
    RouteInfraLink<InfraLinkMatchingFieldsFragment>
  >,
) {
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
}

/**
 * Validate all the (same label) instances of a stop.
 * We don't allow stops that may have active instances outside of the route geometry
 * @param stop a single stop instance
 * @param routeValidity the validity period of the route
 * @param routeInfraLinks all the infra links along the route
 */
function validateStopInstancesAlongGeometry(
  stop: RouteStopFieldsFragment,
  routeValidity: RouteValidityFragment,
  routeInfraLinks: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >,
) {
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
}

const sortStopsByTraversalForwards: Comparator<
  ScheduledStopPointAllFieldsFragment
> = (stop1, stop2) =>
  stop1.relative_distance_from_infrastructure_link_start -
  stop2.relative_distance_from_infrastructure_link_start;

/**
 * Comparator for sorting stops of the same link based on the distance from the link start.
 * Note that the distances need to be inverted when the link is traversed backwards.
 * @param isTraversalForwards the traversal direction of the route along the link
 */
function sortStopsOnInfraLinkComparator(
  isTraversalForwards: boolean,
): Comparator<ScheduledStopPointAllFieldsFragment> {
  return isTraversalForwards
    ? sortStopsByTraversalForwards
    : flip(sortStopsByTraversalForwards);
}

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
 * @param infraLinksWithStops list of infra links (in order) with the stops on them
 * @param routeMetadata  metadata about the edited route (e.g. priority, validity period)
 */
export function extractJourneyPatternCandidateStops(
  infraLinksWithStops: ReadonlyArray<
    RouteInfraLink<InfraLinkAlongRouteWithStopsFragment['infrastructure_link']>
  >,
  routeMetadata: RouteValidityFragment,
) {
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
          isStopValidDuringRouteValidity(stop, routeMetadata) &&
          isStopActive(stop),
      )
      .sort(sortStopsOnInfraLinkComparator(isTraversalForwards));
  });

  // for draft routes, we don't check the integrity of the journey pattern
  // e.g. are all the stop instances along the route and in the correct order
  if (routeMetadata.priority === Priority.Draft) {
    return filteredStops;
  }

  // checking the integrity of the journey pattern | return valid stops
  return filteredStops.filter((stop) =>
    validateStopInstancesAlongGeometry(
      stop,
      routeMetadata,
      infraLinksWithStops,
    ),
  );
}
