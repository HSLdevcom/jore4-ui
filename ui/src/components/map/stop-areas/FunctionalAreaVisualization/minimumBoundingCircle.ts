// Cleaned and typed up based on: https://observablehq.com/@jleedev/minimum-bounding-circle

import {
  Units,
  circle,
  convertLength,
  convex,
  distance,
  getCoord,
  greatCircle,
  lineIntersect,
  midpoint,
  polygon,
} from '@turf/turf';
import { Feature, FeatureCollection, Geometry, Point, Polygon } from 'geojson';
import { CenterRadius, Coordinates } from './types';

type FeatureOrGeo = Feature | FeatureCollection | Geometry;
type Triangle = Polygon;

function getTrianglePoints(
  triangle: Triangle,
): [Coordinates, Coordinates, Coordinates] {
  return [
    triangle.coordinates[0][0] as Coordinates,
    triangle.coordinates[0][1] as Coordinates,
    triangle.coordinates[0][2] as Coordinates,
  ];
}

function trianglePolygon(
  a: Coordinates,
  b: Coordinates,
  c: Coordinates,
): Triangle {
  return polygon([[a, b, c, a]]).geometry;
}

function perpendicularBisector(a: Coordinates, b: Coordinates) {
  const d = distance(a, b);

  const ad = circle(a, d);
  const bd = circle(b, d);

  const intersections = lineIntersect(ad, bd);
  const intersectionPoints = intersections.features.map(
    (intersection) => getCoord(intersection) as Coordinates,
  );

  if (intersectionPoints.length !== 2) {
    throw new Error('broke');
  }

  return greatCircle(intersectionPoints[0], intersectionPoints[1]);
}

function triangleCircumcircle(triangle: Triangle): CenterRadius {
  const trianglePoints = getTrianglePoints(triangle);
  const [a, b, c] = trianglePoints;

  const abBi = perpendicularBisector(a, b);
  const bcBi = perpendicularBisector(b, c);
  const acBi = perpendicularBisector(a, c);

  const intersections = [
    lineIntersect(abBi, bcBi),
    lineIntersect(bcBi, acBi),
    lineIntersect(acBi, abBi),
  ].flatMap((f) => f.features);

  if (intersections.length === 0) {
    throw new Error('Failed to intersect perpendicular bisectors!');
  }

  let center: Coordinates | null = null;
  let radius = -Infinity;
  intersections.forEach((center1) => {
    trianglePoints.forEach((outer1) => {
      const newDist = distance(center1, outer1);
      if (newDist > radius) {
        radius = newDist;
        center = center1.geometry.coordinates as Coordinates;
      }
    });
  });

  // This should never happen, but here to make typings happy.
  if (!center) {
    throw new Error('Loop did not find a center!');
  }

  return { center, radius };
}

type LongestSideParams = {
  readonly center: Feature<Point>;
  readonly radius: number;
  readonly third: Coordinates;
};

function getObtuseTriangleLongestSideParams(
  triangle: Triangle,
): LongestSideParams {
  const [a, b, c] = getTrianglePoints(triangle);

  const ab = distance(a, b);
  const bc = distance(b, c);
  const ac = distance(a, c);

  const longest = Math.max(ab, bc, ac);

  switch (longest) {
    case ab:
      return {
        center: midpoint(a, b),
        radius: ab / 2,
        third: c,
      };

    case bc:
      return {
        center: midpoint(b, c),
        radius: bc / 2,
        third: a,
      };

    case ac:
      return {
        center: midpoint(a, c),
        radius: ac / 2,
        third: b,
      };

    default:
      throw new Error('This should never happen!');
  }
}

function getCenterRadiusIfTriangleIsObtuse(
  triangle: Triangle,
): CenterRadius | null {
  // Just go ahead and try the longest side as diameter If it works
  // it's the shortest.  Otherwise, triangle was not obtuse.
  const { center, radius, third } =
    getObtuseTriangleLongestSideParams(triangle);

  if (distance(center, third) < radius) {
    return { center: center.geometry.coordinates as Coordinates, radius };
  }

  return null;
}

function minimumBoundingCircleOfTriangle(triangle: Triangle): CenterRadius {
  // Acute triangle: minimum bounding circle is the circumcircle
  // Obtuse triangle: minimum bounding circle has the longest side as diameter

  const obtuseTriangleResult = getCenterRadiusIfTriangleIsObtuse(triangle);

  if (obtuseTriangleResult) {
    return obtuseTriangleResult;
  }

  // OK, go for circumcircle.
  return triangleCircumcircle(triangle);
}

function minimumBoundingCircleRecurse(
  points: ReadonlyArray<Coordinates>,
  selected: ReadonlyArray<Coordinates>,
): CenterRadius {
  if (points.length === 0 || selected.length === 3) {
    // Base cases
    if (selected.length === 1) {
      return { center: selected[0], radius: 0 };
    }

    if (selected.length === 2) {
      const [a, b] = selected;
      const center = midpoint(a, b);
      const radius = distance(a, center);
      return { center: center.geometry.coordinates as Coordinates, radius };
    }

    if (selected.length === 3) {
      const [a, b, c] = selected;
      return minimumBoundingCircleOfTriangle(trianglePolygon(a, b, c));
    }

    return { center: [0, 0], radius: 0 };
  }

  const p1 = points[0];
  const rest = points.slice(1);
  const result = minimumBoundingCircleRecurse(rest, selected);
  if (distance(result.center, p1) < result.radius) {
    // Success, the recursive case returned a circle which satisfies p1
    return result;
  }

  // Include p1 in the boundary set
  return minimumBoundingCircleRecurse(rest, [...selected, p1]);
}

// Calculate s hull (outline) that covers all the points,
// and discard the points contained within that hull.
function getSimplifiedPoints(item: FeatureOrGeo) {
  const hull = convex(item);

  if (!hull) {
    throw new Error(
      `Unable to construct a convex hull on feature: ${JSON.stringify(item, null, 0)}`,
    );
  }

  // Hull is a simple polygon, with only a single sub path.
  return hull.geometry.coordinates[0] as Array<Coordinates>;
}

function inplaceFisherYatesShuffle<T>(array: Array<T>): void {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line no-param-reassign
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Welzl's algorithm
export function minimumBoundingCircle(
  feature: FeatureOrGeo,
  units: Units,
): CenterRadius {
  const points = getSimplifiedPoints(feature);
  // Algorithm tells to process them in random order 🤷
  inplaceFisherYatesShuffle(points);

  const result = minimumBoundingCircleRecurse(points, []);

  if (units === 'kilometers') {
    return result;
  }

  return {
    center: result.center,
    radius: convertLength(result.radius, 'kilometers', units),
  };
}
