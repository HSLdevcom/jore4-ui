import { DateTime } from 'luxon';
import {
  RouteAllFieldsFragment,
  RouteTableRowFragment,
  RouteValidityFragment,
} from '../generated/graphql';
import { isDateInRange } from '../time';

/**
 * Type that includes route_journey_patterns with journey pattern refs. This is used
 * for checking if route has timetables, and this is used for type checking that the
 * object has only the necessary information. So the routeHasTimetables() can be called
 * with any route object, as long as it has
 * route_journey_patterns: {
 *   journey_pattern_refs
 * }
 */
type RouteJourneyPatternsWithJourneyPatternRefs = {
  route_journey_patterns: ReadonlyArray<
    Pick<
      RouteTableRowFragment['route_journey_patterns'][0],
      'journey_pattern_refs'
    >
  >;
};

/**
 * Checks if the route has any vehicle_journey's existing. If there is
 * that means that the route has timetables.
 */
export const routeHasTimetables = (
  route: RouteJourneyPatternsWithJourneyPatternRefs,
) =>
  route.route_journey_patterns.some((routeJourneyPattern) =>
    routeJourneyPattern.journey_pattern_refs.some(
      (journeyPatternRefs) => journeyPatternRefs.vehicle_journeys.length,
    ),
  );

export type RouteWithLabel = Pick<RouteAllFieldsFragment, 'label' | 'variant'>;

export const hasRouteVariant = (route: RouteWithLabel) =>
  Number.isInteger(route?.variant);

export const getRouteLabelVariantText = (route: RouteWithLabel) =>
  `${route.label}${hasRouteVariant(route) ? ` ${route.variant}` : ''}`;

export const isRouteActiveOnObservationDate = (
  route: Pick<RouteValidityFragment, 'validity_start' | 'validity_end'>,
  observationDate: DateTime,
) => isDateInRange(observationDate, route.validity_start, route.validity_end);
