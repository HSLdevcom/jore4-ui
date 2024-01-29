import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HTMLOverlay, Layer, MapEvent } from 'react-map-gl';
import {
  useAppDispatch,
  useAppSelector,
  useFilterStops,
  useGetRoutesDisplayedInMap,
} from '../../hooks';
import { Column } from '../../layoutComponents';
import {
  FilterType,
  selectHasDraftRouteGeometry,
  selectIsCreateStopModeEnabled,
  selectIsMoveStopModeEnabled,
  selectMapFilter,
  selectMapRouteEditor,
  selectSelectedRouteId,
  setSelectedRouteIdAction,
} from '../../redux';
import { FilterPanel, placeholderToggles } from '../../uiComponents';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import {
  DraftRouteGeometryLayer,
  DrawRouteLayer,
  EditRouteMetadataLayer,
  RouteEditor,
  isRouteGeometryLayer,
  mapLayerIdToRouteId,
} from './routes';
import { ExistingRouteGeometryLayer } from './routes/ExistingRouteGeometryLayer';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopFilterOverlay } from './StopFilterOverlay';
import { Stops } from './stops';

interface Props {
  drawable?: boolean;
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  {
    drawable = false,
    className = '',
    width = '100vw',
    height = '100vh',
  }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const routeEditorRef = useRef<ExplicitAny>(null);

  const { drawingMode } = useAppSelector(selectMapRouteEditor);

  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const { showStopFilterOverlay } = useAppSelector(selectMapFilter);

  const dispatch = useAppDispatch();
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const { displayedRouteIds } = useGetRoutesDisplayedInMap();

  const routeDisplayed = !!displayedRouteIds?.length;

  const [showInfraLinks, setShowInfraLinks] = useState(false);
  const [showRoute, setShowRoute] = useState(true);
  const { toggleFunction, isFilterActive } = useFilterStops();

  const isCreateStopModeEnabled = useAppSelector(selectIsCreateStopModeEnabled);
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);

  // TODO: avoid any type
  const editorLayerRef = useRef<ExplicitAny>(null);
  const stopsRef = useRef<ExplicitAny>(null);

  useImperativeHandle(externalRef, () => ({
    onDrawRoute: () => {
      routeEditorRef.current?.onDrawRoute();
    },
    onEditRoute: () => {
      routeEditorRef.current?.onEditRoute();
    },
    onDeleteRoute: () => {
      routeEditorRef.current?.onDeleteRoute();
    },
    onCancel: () => {
      routeEditorRef.current?.onCancel();
    },
    onSave: () => {
      routeEditorRef.current?.onSave();
    },
  }));

  const onCreateStop = (e: MapEvent) => {
    if (stopsRef.current && drawingMode === undefined) {
      stopsRef.current.onCreateStop(e);
    }
  };

  const onMoveStop = (e: MapEvent) => {
    if (!drawingMode) {
      stopsRef.current?.onMoveStop(e);
    }
  };

  const onClick = (e: MapEvent) => {
    if (isCreateStopModeEnabled) {
      onCreateStop(e);
      return;
    }
    if (isMoveStopModeEnabled) {
      onMoveStop(e);
    }

    // Retrieve all rendered features on the map
    const { features } = e;

    // If the clicked feature was a route, select it
    if (features?.length) {
      const routeFeatures = features.filter((feature) =>
        isRouteGeometryLayer(feature.layer.id),
      );

      if (routeFeatures.length) {
        const routeId = mapLayerIdToRouteId(routeFeatures[0].layer.id);

        // set clicked route as selected
        dispatch(setSelectedRouteIdAction(routeId));

        return;
      }
    }

    // If clicked away, unselect route (if any)
    if (selectedRouteId) {
      dispatch(setSelectedRouteIdAction(undefined));
    }
  };

  const { t } = useTranslation();

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      <Stops ref={stopsRef} />
      <HTMLOverlay
        style={{
          width: 'auto',
          height: 'auto',
          maxHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        redraw={() => (
          <>
            <Column className="items-start overflow-hidden p-8">
              <FilterPanel
                routes={[
                  {
                    iconClassName: 'icon-bus',
                    active: showRoute,
                    onToggle: setShowRoute,
                    disabled: !routeDisplayed,
                    testId: 'FilterPanel::toggleShowBusRoutes',
                    tooltip: t('vehicleModeEnum.bus'),
                  },
                  // We want to show placeholder toggles of unimplemented features for visual purposes
                  ...placeholderToggles,
                ]}
                stops={[
                  {
                    iconClassName: 'icon-bus',
                    active: isFilterActive(FilterType.ShowAllBusStops),
                    onToggle: toggleFunction(FilterType.ShowAllBusStops),
                    testId: 'FilterPanel::toggleShowAllBusStops',
                    tooltip: t('vehicleModeEnum.bus'),
                  },
                  ...placeholderToggles,
                ]}
                infraLinks={{
                  active: showInfraLinks,
                  onToggle: setShowInfraLinks,
                  testId: 'FilterPanel::toggleShowInfraLinks',
                }}
              />
              {(!!selectedRouteId || hasDraftRouteGeometry) && (
                <RouteStopsOverlay className="mt-4 overflow-hidden" />
              )}
            </Column>
          </>
        )}
        captureClick
        captureDoubleClick
        captureDrag
        captureScroll
      />
      <HTMLOverlay
        style={{
          top: 'auto',
          left: 'auto',
          bottom: 0,
          right: 0,
          width: 'auto',
          height: 'auto',
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        redraw={() => (
          <Column>
            {showStopFilterOverlay && (
              <StopFilterOverlay className="mr-12 mb-4" />
            )}
            <ObservationDateOverlay className="mr-12 mb-8" />
          </Column>
        )}
        captureClick
        captureDoubleClick
        captureDrag
        captureScroll
      />
      <EditRouteMetadataLayer />
      {drawable && <DrawRouteLayer mode={drawingMode} ref={editorLayerRef} />}
      {showInfraLinks && <InfraLinksVectorLayer />}
      {/**
       * Empty layer for dynamically ordering route layers
       * https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
       */}
      <Layer
        id="route_base"
        type="background"
        layout={{ visibility: 'none' }}
        paint={{}}
      />
      {showRoute &&
        routeDisplayed &&
        displayedRouteIds?.map((item) => (
          <ExistingRouteGeometryLayer
            key={item}
            routeId={item}
            isSelected={selectedRouteId === item && !hasDraftRouteGeometry}
          />
        ))}
      <DraftRouteGeometryLayer />
      <RouteEditor
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDeleteRoute()}
        ref={routeEditorRef}
      />
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
