import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  RouteLabelAndVariantFragment,
  RouteValidityPeriodFragment,
} from '../generated/graphql';
import { isDateInRange } from '../time';

const GQL_ROUTE_HELPER_FRAGMENTS = gql`
  fragment RouteLabelAndVariant on route_route {
    label
    variant
  }

  fragment RouteValidityPeriod on route_route {
    validity_start
    validity_end
  }
`;

export function hasRouteVariant(route: RouteLabelAndVariantFragment) {
  return Number.isInteger(route?.variant);
}

export function getRouteLabelVariantText(route: RouteLabelAndVariantFragment) {
  if (hasRouteVariant(route)) {
    return `${route.label} ${route.variant}`;
  }

  return route.label;
}

export function isRouteActiveOnObservationDate(
  route: RouteValidityPeriodFragment,
  observationDate: DateTime,
) {
  return isDateInRange(
    observationDate,
    route.validity_start,
    route.validity_end,
  );
}
