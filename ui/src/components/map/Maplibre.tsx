import distance from '@turf/distance';
import { point, Units } from '@turf/helpers';
import { generateStyle } from 'hsl-map-style';
import debounce from 'lodash/debounce';
import { FunctionComponent, useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { MapEvent, MapRef, NavigationControl } from 'react-map-gl';
import { useAppDispatch, useLoader, useMapQueryParams } from '../../hooks';
import { Operation, setViewPortAction } from '../../redux';

interface Props {
  className?: string;
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...
  width?: string;
  height?: string;
  onClick?: (e: MapEvent) => void;
  useVectorTilesAsBaseMap?: boolean;
}

interface MaplibreViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

const style = generateStyle();

export const Maplibre: FunctionComponent<Props> = ({
  className = '',
  onClick,
  width = '100vw',
  height = '100vh',
  children,
}) => {
  const mapRef = useRef<MapRef>(null);

  const { mapPosition, setMapPosition } = useMapQueryParams();

  const [viewport, setViewport] = useState<MaplibreViewport>({
    ...mapPosition,
    bearing: 0,
    pitch: 0,
  });

  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoader(Operation.LoadMap, {
    immediatelyOn: true,
  });

  const updateMapDetailsDebounced = useMemo(
    () =>
      debounce((latitude, longitude, zoom, radius) => {
        dispatch(
          setViewPortAction({
            latitude,
            longitude,
            radius,
          }),
        );
        setMapPosition(latitude, longitude, zoom);
      }, 800),
    [dispatch, setMapPosition],
  );

  const onViewportChange = (newViewport: MaplibreViewport) => {
    setViewport(newViewport);

    if (mapRef.current) {
      const mapGL = mapRef.current.getMap();

      // Viewport change event can be fired before map is completely loaded
      // resulting in stops to be loaded for incorrect view
      if (!mapGL.loaded()) return;

      const bounds = mapGL.getBounds();

      const from = point([newViewport.longitude, newViewport.latitude]);
      // eslint-disable-next-line no-underscore-dangle
      const to = point([bounds._sw.lng, bounds._sw.lat]);
      const options = { units: 'meters' as Units };

      const radius = distance(from, to, options);

      // Update map details with a debounce to avoid hundreds of updates while
      // user is changing map position
      updateMapDetailsDebounced(
        newViewport.latitude,
        newViewport.longitude,
        newViewport.zoom,
        radius,
      );
    }
  };

  // Load arrow image
  useEffect(() => {
    const map = mapRef.current?.getMap();

    // Maplibre does not have types for these
    map.loadImage('/img/arrow-right.png', (error: unknown, image: unknown) => {
      if (error) throw error;

      // Enable sdf to make enable icon coloring.
      // https://docs.mapbox.com/help/troubleshooting/using-recolorable-images-in-mapbox-maps/
      if (!map.hasImage('arrow')) map.addImage('arrow', image, { sdf: true });
    });
  }, [mapRef]);

  const navStyle = {
    bottom: 72,
    right: 0,
    padding: '10px',
  };

  const getCursor = ({
    isHovering,
    isDragging,
  }: {
    isLoaded: boolean;
    isDragging: boolean;
    isHovering: boolean;
  }) => {
    if (isDragging) {
      return 'grabbing';
    }
    // TODO: seems like we never actually receive isHovering as true
    return isHovering ? 'pointer' : 'default';
  };

  const transformRequest = (url: string) => {
    if (url.startsWith('/')) {
      // mapbox gl js doesn't handle relative url's. As a workaround
      // we can make those url's non-relative by prepending those with
      // window.location.origin
      // https://github.com/mapbox/mapbox-gl-js/issues/10407
      const newUrl = window.location.origin + url;
      return {
        url: newUrl,
      };
    }
    return undefined;
  };

  const onLoad = () => {
    setIsLoading(false);
    onViewportChange(viewport);
  };

  useEffect(() => {
    // Cancel the debounced update if the map is going to be closed.
    return () => {
      updateMapDetailsDebounced.cancel();
    };
  }, [updateMapDetailsDebounced]);

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      width={width}
      height={height}
      onViewportChange={onViewportChange}
      onClick={onClick}
      className={className}
      mapStyle={style}
      getCursor={getCursor}
      transformRequest={transformRequest}
      doubleClickZoom={false}
      ref={mapRef}
      onLoad={onLoad}
    >
      {children}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
