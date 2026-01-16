import { generateStyle } from 'hsl-map-style';
import debounce from 'lodash/debounce';
import type { LngLatBoundsLike } from 'maplibre-gl';
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
import { joreConfig } from '../../config';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  LoadingState,
  Operation,
  selectMapViewport,
  setViewPortAction,
} from '../../redux';
import { log, showWarningToast } from '../../utils';
import { getInteractiveLayerIds, loadMapAssets } from '../../utils/map';
import { useLoader } from '../common/hooks/useLoader';
import { isViewportLoaded } from './utils/isViewportLoaded';
import { useMapUrlStateContext } from './utils/mapUrlState';

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
      value: joreConfig.digitransitApiKey,
    },
    {
      url: 'https://cdn.digitransit.fi/',
      name: 'digitransit-subscription-key',
      value: joreConfig.digitransitApiKey,
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

  const {
    state: { viewPort: urlViewPort },
    setViewPort: setUrlViewPort,
  } = useMapUrlStateContext();

  const [viewport, setViewport] = useState<MaplibreViewport>({
    ...urlViewPort,
    bearing: 0,
    pitch: 0,
  });

  const reduxViewport = useAppSelector(selectMapViewport);
  const dispatch = useAppDispatch();
  const { setLoadingState } = useLoader(Operation.LoadMap, {
    initialState: LoadingState.HighPriority,
  });

  const updateMapDetailsDebounced = useMemo(
    () =>
      debounce(
        (
          latitude: number,
          longitude: number,
          zoom: number,
          bounds: [number, number][],
        ) => {
          dispatch(
            setViewPortAction({
              latitude,
              longitude,
              bounds,
            }),
          );
          setUrlViewPort({ latitude, longitude, zoom });
        },
        800,
      ),
    [dispatch, setUrlViewPort],
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

      // Update map details with a debounce to avoid hundreds of updates while
      // user is changing map position
      updateMapDetailsDebounced(
        newViewport.latitude,
        newViewport.longitude,
        newViewport.zoom,
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
    if (isViewportLoaded(reduxViewport)) {
      // Ensure the zoom happens asynchronously regardless of the browsers
      // reduced motion setting. Having the zoom triggered synchronously here
      // can lead to wrong viewport getting written in the redux store.
      setTimeout(() => {
        mapRef.current
          ?.getMap()
          .fitBounds(reduxViewport.bounds as LngLatBoundsLike);
      }, 0);
    } else {
      onViewportChange(viewport);
    }

    // Flush the initial state into Redux store immediately. Else the subcomponents
    // that are waiting for the map to load, by observing the Redux store, will
    // have to wait for the debounce period before thet can begin loading data.
    updateMapDetailsDebounced.flush();

    // Expose global function for Cypress testing to convert coordinates to screen pixels
    if (mapRef.current) {
      const mapGL = mapRef.current.getMap();
      window.coordinatesToOnScreenPixels = (
        longitude: number,
        latitude: number,
      ) => {
        return mapGL.project([longitude, latitude]);
      };
    }
  };

  const onError = ({ error }: ErrorEvent) => {
    showWarningToast(t('map.error', { message: error.message }));
    log.error('Map error:', error);
  };

  // LineId: ThisCleanUpEffect
  // Cancel the debounced update if the map is going to be closed.
  useEffect(
    () => () => updateMapDetailsDebounced.cancel(),
    [updateMapDetailsDebounced],
  );

  useEffect(
    () => () => {
      // Clean up global function when component unmounts
      if (window.coordinatesToOnScreenPixels) {
        delete window.coordinatesToOnScreenPixels;
      }
    },
    [],
  );

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
