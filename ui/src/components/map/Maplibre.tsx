import { Units, distance, point } from '@turf/turf';
import { generateStyle } from 'hsl-map-style';
import debounce from 'lodash/debounce';
import {
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import MapGL, {
  ErrorEvent,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
} from 'react-map-gl/maplibre';
import { useAppDispatch, useMapQueryParams } from '../../hooks';
import { LoadingState, Operation, setViewPortAction } from '../../redux';
import { log, showWarningToast } from '../../utils';
import { getInteractiveLayerIds, loadMapAssets } from '../../utils/map';
import { useLoader } from '../common/hooks/useLoader';

type MaplibreProps = {
  readonly className?: string;
  // width and height are passed as params to `react-map-gl`.
  // It seems to support certain css features, e.g. "100vh" or "100px",
  // but in other hand "100%" doesn't seem to work...
  readonly width?: string;
  readonly height?: string;
  readonly onClick?: (e: MapLayerMouseEvent) => void;
  readonly useVectorTilesAsBaseMap?: boolean;
};

type MaplibreViewport = {
  readonly latitude: number;
  readonly longitude: number;
  readonly zoom: number;
  readonly bearing: number;
  readonly pitch: number;
};

const style = generateStyle({
  queryParams: [
    {
      url: 'https://api.digitransit.fi/',
      name: 'digitransit-subscription-key',
      value: process.env.NEXT_PUBLIC_DIGITRANSIT_API_KEY,
    },
    {
      url: 'https://cdn.digitransit.fi/',
      name: 'digitransit-subscription-key',
      value: process.env.NEXT_PUBLIC_DIGITRANSIT_API_KEY,
    },
  ],
});

export const Maplibre: FC<PropsWithChildren<MaplibreProps>> = ({
  onClick,
  width = '100vw',
  height = '100vh',
  children,
}) => {
  const { t } = useTranslation();

  const mapRef = useRef<MapRef>(null);

  const { mapPosition, setMapPosition } = useMapQueryParams();

  const [viewport, setViewport] = useState<MaplibreViewport>({
    ...mapPosition,
    bearing: 0,
    pitch: 0,
  });

  const dispatch = useAppDispatch();
  const { setLoadingState } = useLoader(Operation.LoadMap, {
    initialState: LoadingState.HighPriority,
  });

  // Due to the fucked up way the old Query string parsing and updating hooks
  // are constructed they setter functions do not have proper stability.
  // They are updated every time the query gets changed (param value added,
  // deleted, changed or order changed). Thus using this unstable function as
  // hook dependency introduces the same unstability to `updateMapDetailsDebounced`
  // which in turn, combined with the cleanup useEffect (search ThisCleanUpEffect),
  // that cancels any pending call, as it should, can result in viewPort updates
  // getting completely missed.
  // Thus, setMapPosition is wrapped into a ref here, so we can always call the
  // latest version from within the debounced function, no matter when a call to
  // it has happened.
  const setMapPositionRef = useRef(setMapPosition);
  setMapPositionRef.current = setMapPosition;

  const updateMapDetailsDebounced = useMemo(
    () =>
      debounce(
        (
          latitude: number,
          longitude: number,
          zoom: number,
          radius: number,
          bounds: [number, number][],
        ) => {
          dispatch(
            setViewPortAction({
              latitude,
              longitude,
              radius,
              bounds,
            }),
          );
          setMapPositionRef.current(latitude, longitude, zoom);
        },
        800,
      ),
    [dispatch],
  );

  const onViewportChange = (newViewport: MaplibreViewport) => {
    setViewport(newViewport);

    if (mapRef.current) {
      const mapGL = mapRef.current.getMap();

      // Viewport change event can be fired before map is completely loaded
      // resulting in stops to be loaded for incorrect view
      // eslint-disable-next-line no-underscore-dangle
      if (!mapGL._loaded) {
        return;
      }

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
        bounds.toArray(),
      );
    }
  };

  const navStyle = {
    bottom: 72,
    right: 0,
    padding: '10px',
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
    return { url };
  };

  const onLoad = () => {
    setLoadingState(LoadingState.NotLoading);
    onViewportChange(viewport);

    // Flush the initial state into Redux store immediately. Else the subcomponents
    // that are waiting for the map to load, by observing the Redux store, will
    // have to wait for the debounce period before thet can begin loading data.
    updateMapDetailsDebounced.flush();
  };

  const onError = ({ error }: ErrorEvent) => {
    showWarningToast(t('map.error', { message: error.message }));
    log.error('Map error:', error);
  };

  // LineId: ThisCleanUpEffect
  useEffect(() => {
    // Cancel the debounced update if the map is going to be closed.
    return () => {
      updateMapDetailsDebounced.cancel();
    };
  }, [updateMapDetailsDebounced]);

  loadMapAssets(mapRef);
  const interactiveLayerIds = getInteractiveLayerIds(mapRef);

  return (
    <MapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewport}
      style={{
        width,
        height,
      }}
      onClick={onClick}
      mapStyle={style as ExplicitAny}
      onMove={(event) => onViewportChange(event.viewState)}
      onMoveEnd={(event) => onViewportChange(event.viewState)}
      doubleClickZoom={false}
      ref={mapRef}
      onLoad={onLoad}
      onError={onError}
      transformRequest={transformRequest}
      interactiveLayerIds={interactiveLayerIds}
      cursor="auto"
      attributionControl={false}
    >
      {children}
      <NavigationControl style={navStyle} showCompass={false} />
    </MapGL>
  );
};
