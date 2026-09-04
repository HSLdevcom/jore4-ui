import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import {
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
} from '../../../../generated/graphql';
import { Priority } from '../../../../types/enums';
import { filterHighestPriorityCurrentStops } from '../../../../utils';
import {
  extractJourneyPatternCandidateStops,
  mapInfrastructureLinksAlongRouteToRouteInfraLinks,
  stopBelongsToJourneyPattern,
} from '../../../LinesAndRoutes/Common';
import { QuayAndStopPlaceIds } from './types';

/**
 * Resolve the stops of a route in driving order, keeping only the highest
 * priority current instance of each stop that belongs to the journey pattern.
 * Mirrors the stop list shown on the line page route row.
 */
export function getRouteJourneyPatternStops(
  route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  observationDate: DateTime,
): ReadonlyArray<RouteStopFieldsFragment> {
  const links = mapInfrastructureLinksAlongRouteToRouteInfraLinks(
    route.infrastructure_links_along_route,
  );
  const stopsAlongRoute = extractJourneyPatternCandidateStops(links, route);

  const highestPriorityCurrentStops = filterHighestPriorityCurrentStops(
    stopsAlongRoute,
    observationDate,
    route.priority === Priority.Draft,
  );

  return highestPriorityCurrentStops.filter((stop) =>
    stopBelongsToJourneyPattern(stop, route.route_id),
  );
}

/**
 * Extract the Quay NetexIDs of the ordered route stops. Stops without a
 * resolvable quay NetexID are dropped. The driving order is preserved.
 */
export function routeStopsToOrderedQuayNetexIds(
  stops: ReadonlyArray<RouteStopFieldsFragment>,
): ReadonlyArray<string> {
  return compact(stops.map((stop) => stop.newest_quay?.netex_id));
}

/**
 * Reorder resolved Quay + StopPlace id pairs to match the driving order given
 * by the ordered quay NetexIDs. Quays without a resolved pair are dropped.
 */
export function orderIdPairsByQuayNetexIds(
  orderedQuayNetexIds: ReadonlyArray<string>,
  pairs: ReadonlyArray<QuayAndStopPlaceIds>,
): ReadonlyArray<QuayAndStopPlaceIds> {
  const pairByQuayNetexId = new Map(
    pairs.map((pair) => [pair.quayNetexId, pair]),
  );

  return compact(
    orderedQuayNetexIds.map((quayNetexId) =>
      pairByQuayNetexId.get(quayNetexId),
    ),
  );
}
