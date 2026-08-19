import { GeometryComparisonExp } from '../../../generated/graphql';
import { Viewport } from '../../../redux';

export function buildWithinViewportGqlGeometryFilter(
  viewport: Viewport,
): GeometryComparisonExp {
  const [[west, south], [east, north]] = viewport.bounds;

  return {
    _st_within: {
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
    },
  };
}
