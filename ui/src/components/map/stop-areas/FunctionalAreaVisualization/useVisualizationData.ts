import {
  bbox,
  circle,
  destination,
  distance,
  featureCollection,
} from '@turf/turf';
import { BBox, Geometry } from 'geojson';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { useMemo } from 'react';
import { memoizeOne } from '../../../../utils';
import { MapStop } from '../../types';
import {
  areaCirclePadding,
  minFunctionalArea,
  pixelSize,
  steps,
  units,
} from './constants';
import { minimumBoundingCircle } from './minimumBoundingCircle';
import {
  CenterRadius,
  Circles,
  Coordinates,
  PixelCoordinateConverter,
  PixelCoordinates,
} from './types';

function toClampedPixels(percentage: number): number {
  return Math.max(Math.min(percentage * pixelSize, pixelSize), 0);
}

function isFiniteNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

function getMinFunctionalArea({ functional_area: fArea }: MapStop): number {
  if (isFiniteNumber(fArea) && fArea >= minFunctionalArea) {
    return fArea;
  }

  return minFunctionalArea;
}

function selectAndMapStops(
  stops: ReadonlyArray<MapStop>,
  selectedStopAreaId: string | undefined | null,
): ReadonlyArray<CenterRadius> | null {
  if (!selectedStopAreaId) {
    return null;
  }

  const mapped = stops
    .filter((stop) => stop.stop_place_netex_id === selectedStopAreaId)
    .map((stop) => ({
      center: stop.location.coordinates as Coordinates,
      radius: getMinFunctionalArea(stop),
    }));

  return mapped.length ? mapped : null;
}

function calculateCircles(
  stops: ReadonlyArray<CenterRadius> | null,
): Circles | null {
  if (!stops) {
    return null;
  }

  const stopCircleFeatures = featureCollection<Geometry>(
    stops.map((stop) =>
      circle(stop.center, stop.radius, {
        steps,
        units,
      }),
    ),
  );

  const areaCircle = minimumBoundingCircle(stopCircleFeatures, units);

  return {
    area: {
      center: areaCircle.center,
      radius: areaCircle.radius + areaCirclePadding,
    },
    stops,
  };
}

// Are the given values Arrays with items that compare true with `_.isEqual` in any order.
function arraysContainEqualItems(a: unknown, b: unknown): boolean {
  if (a === b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  return a.every((aItem: unknown) =>
    b.some((bItem: unknown) => isEqual(aItem, bItem)),
  );
}

function useCircles(
  stops: ReadonlyArray<MapStop>,
  selectedStopAreaId: string | undefined,
): Circles | null {
  // Filtering the valid stops out of stops array always creates a new array.
  // And as the stops array gets recreated pretty much when ever the map is moved,
  // or zoomed, we end up generating a new filtered array. But the actual data,
  // we select for down stream, does not change. So after the normal mapping of the
  // data in a useMemo(calc, [stops]) hook, add another layer of memoization.
  // If the actual data in the new array, is functionally identical to the data
  // in the new array, return the old array instead -> Short circuits useMemo calls
  // further down stream, and we can avoid a recalculation / rendering of the data.
  const stabilizeResult = useMemo(
    () =>
      memoizeOne(
        (data: ReadonlyArray<CenterRadius>) => data,
        arraysContainEqualItems,
      ),
    [],
  );

  const stopData = useMemo(() => {
    const mapped = selectAndMapStops(stops, selectedStopAreaId);

    if (mapped) {
      // Duplicates break the rendering
      const deduped = uniqWith(mapped, isEqual);
      return stabilizeResult(deduped);
    }

    return null;
  }, [stops, selectedStopAreaId, stabilizeResult]);

  return useMemo(() => calculateCircles(stopData), [stopData]);
}

function useBoundingBox(circles: Circles | null): BBox | null {
  const area = circles?.area;
  return useMemo(() => {
    if (!area) {
      return null;
    }

    const { center, radius } = area;
    return bbox(
      featureCollection([
        destination(center, radius, 180, { units }),
        destination(center, radius, 90, { units }),
        destination(center, radius, 0, { units }),
        destination(center, radius, -90, { units }),
      ]),
    );
  }, [area]);
}

function useConvertToPixelCoordinates(
  boundingBox: BBox | null,
): PixelCoordinateConverter | null {
  return useMemo(() => {
    if (!boundingBox) {
      return null;
    }

    // Works and produces fine, but not geographically perfect results,
    // around Southern finland with our use cases. (~5cm of distortion)
    const [west, north, east, south] = boundingBox;
    const width = distance([west, north], [east, north], { units });
    const height = distance([west, north], [west, south], { units });

    const coordinates = ([
      longitude,
      latitude,
    ]: Coordinates): PixelCoordinates => {
      const distanceFromWestEdge = distance(
        [west, latitude],
        [longitude, latitude],
        { units },
      );
      const distanceFromNorthEdge = distance(
        [longitude, north],
        [longitude, latitude],
        { units },
      );

      const x = toClampedPixels(distanceFromWestEdge / width);
      const y = toClampedPixels(distanceFromNorthEdge / height);

      return [x, y];
    };

    // Instead of a circle, we could generate ellipses with separate rx and ry values.
    // But width ≃ height should only have a difference of ~5cm.
    const radius = (r: number): number => toClampedPixels(r / width);

    return { coordinates, radius };
  }, [boundingBox]);
}

export function useVisualizationData(
  stops: ReadonlyArray<MapStop>,
  selectedStopAreaId: string | undefined,
) {
  const circles = useCircles(stops, selectedStopAreaId);
  const boundingBox = useBoundingBox(circles);
  const converter = useConvertToPixelCoordinates(boundingBox);

  return { circles, boundingBox, converter };
}
