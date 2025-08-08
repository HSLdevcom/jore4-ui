import noop from 'lodash/noop';
import { CanvasSource } from 'maplibre-gl';
import { FC, useEffect } from 'react';
import { MapInstance, useMap } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../../hooks';
import { selectSelectedStopAreaId } from '../../../../redux';
import { MapStop } from '../../types';
import { CanvasRenderer } from './CanvasRenderer';
import { pixelSize } from './constants';
import { useVisualizationData } from './useVisualizationData';

const sourceId = 'FunctionalAreaVisualizationSource';
const layerId = 'FunctionalAreaVisualizationLayer';

function assertIsCanvasSource(source: unknown): asserts source is CanvasSource {
  if (!(source instanceof CanvasSource)) {
    throw new TypeError(
      `Expected source to be a CanvasSource but type is: ${typeof source} | ${source?.constructor?.name}`,
    );
  }
}

// react-map-gl/maplibre does not expose the CanvasSource interface
// so we need to register the source and layer manually.
function useMapSourceAndLayer(map: MapInstance | null) {
  useEffect(() => {
    if (!map) {
      return noop();
    }

    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;

    // Initial placeholder coordinates
    const [west, north, east, south] = [0, 0, 1, 1];
    map.addSource(sourceId, {
      type: 'canvas',
      animate: false,
      canvas,
      coordinates: [
        [west, north],
        [east, north],
        [east, south],
        [west, south],
      ],
    });

    map.addLayer({
      id: layerId,
      type: 'raster',
      source: sourceId,
      minzoom: 14,
      layout: { visibility: 'none' },
    });

    return () => {
      // If the map has not yet de-loaded.
      if (map?.getStyle()) {
        map.removeLayer(layerId);
        map.removeSource(sourceId);
      }
    };
  }, [map]);

  const source = map?.getSource(sourceId);
  const layer = map?.getLayer(layerId);

  if (!source || !layer) {
    return { source: null, layer: null };
  }

  assertIsCanvasSource(source);
  return { source, layer };
}

type FunctionalAreaVisualizationProps = {
  readonly stops: ReadonlyArray<MapStop>;
};

export const FunctionalAreaVisualization: FC<
  FunctionalAreaVisualizationProps
> = ({ stops }) => {
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);

  const { boundingBox, circles, converter } = useVisualizationData(
    stops,
    selectedStopAreaId,
  );

  const map = useMap().current?.getMap() ?? null;

  const { source, layer } = useMapSourceAndLayer(map);

  // Update the source with new data
  useEffect(() => {
    if (!source || !layer) {
      return noop;
    }

    layer.setLayoutProperty('visibility', boundingBox ? 'visible' : 'none');

    if (boundingBox) {
      const [west, north, east, south] = boundingBox;
      source.setCoordinates([
        [west, north],
        [east, north],
        [east, south],
        [west, south],
      ]);
    }

    const renderer = new CanvasRenderer(source.getCanvas());
    renderer.render(converter, circles);

    // Update\reread the texture from the canvas
    source.play();
    source.pause();

    return noop;
  }, [source, layer, boundingBox, circles, converter]);

  return null;
};
