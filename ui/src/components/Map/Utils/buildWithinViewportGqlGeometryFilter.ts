import {
  GeographyComparisonExp,
  GeometryComparisonExp,
} from '../../../generated/graphql';
import { Viewport } from '../../../redux';

function viewportToPolygon(viewport: Viewport): GeoJSON.Polygon {
  const [[west, south], [east, north]] = viewport.bounds;

  return {
    type: 'Polygon',
    coordinates: [
      [
        [west, south],
        [east, south],
        [east, north],
        [west, north],
        [west, south],
      ],
    ],
  };
}

export function buildWithinViewportGqlGeometryFilter(
  viewport: Viewport,
): GeometryComparisonExp {
  return { _st_within: viewportToPolygon(viewport) };
}

// geography columns have no _st_within, so use _st_intersects instead
export function buildWithinViewportGqlGeographyFilter(
  viewport: Viewport,
): GeographyComparisonExp {
  return { _st_intersects: viewportToPolygon(viewport) };
}
