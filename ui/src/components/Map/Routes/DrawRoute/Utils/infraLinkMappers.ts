import { along, length } from '@turf/turf';
import type { Feature, LineString, Point } from 'geojson';
import isEqual from 'lodash/isEqual';
import {
  InfrastructureLinkAllFieldsFragment,
  InfrastructureNetworkDirectionEnum,
  RouteWithInfrastructureLinksFragment,
} from '../../../../../generated/graphql';
import { RouteInfraLink } from '../../../../../types';
import { mapGeoJSONtoFeature } from '../../../../../utils';
import { LineStringFeature } from '../types';

/**
 * Takes a LineString and returns a Point at a specified relative distance along the line.
 * @param feature input feature
 * @param percentage relative distance along the line
 * @returns Point `percentage`% along the line
 */
function relativeAlong(feature: Feature<LineString>, percentage: number) {
  const featureLength = length(feature);

  return along(feature, featureLength * percentage);
}

/**
 * Maps Infrastructure Link to GeoJSON Feature
 * @param link Infrastructure link
 * @returns GeoJSON Feature
 */
function mapInfraLinkToFeature(
  link: RouteInfraLink<InfrastructureLinkAllFieldsFragment>,
) {
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
}

// Minimun length (meters) for infrastructure links,
// from which feature points are picked from
const MIN_INFRA_LINK_POINT_PICK_LENGTH = 15;

type SnapPointCalculationParams = {
  readonly isFirstLink: boolean;
  readonly isLastLink: boolean;
  readonly isLoopLink: boolean;
  readonly isBetweenLink: boolean;
  readonly isOnlyLink: boolean;
  readonly isBidirectional: boolean;
  readonly isLinkLengthValid: boolean;
};

function getSnapPointCalculateParamsForInfraLink(
  linkFeature: GeoJSON.Feature<LineString>,
  direction: InfrastructureNetworkDirectionEnum,
  index: number,
  linkCount: number,
): SnapPointCalculationParams {
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
}

/**
 * Returns relative distances along the infrastructure link for edited route snap points
 * @returns An array of floats which describe the percentage of distance along the infra link geometry
 * to travel to reach the snap point location
 */
function getRelativeSnapPointDistancesAlongLink({
  isFirstLink,
  isLastLink,
  isLoopLink,
  isBetweenLink,
  isOnlyLink,
  isBidirectional,
  isLinkLengthValid,
}: SnapPointCalculationParams) {
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
}

export function mapInfraLinksToFeature(
  infraLinks: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >,
): LineStringFeature {
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
}

export function mapRouteToInfraLinksAlongRoute(
  route: RouteWithInfrastructureLinksFragment,
) {
  return route.infrastructure_links_along_route.map((item) => ({
    ...item.infrastructure_link,
    is_traversal_forwards: item.is_traversal_forwards,
  }));
}
