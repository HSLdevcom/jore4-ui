import React, { Ref, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, MapLayerMouseEvent } from 'react-map-gl/maplibre';
import {
  useAppDispatch,
  useAppSelector,
  useFilterStops,
  useGetRoutesDisplayedInMap,
} from '../../hooks';
import { Column, Visible } from '../../layoutComponents';
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
import { CustomOverlay } from './CustomOverlay';
import { DrawRouteLayer } from './DrawRouteLayer';
import { Maplibre } from './Maplibre';
import { InfraLinksVectorLayer } from './network';
import { ObservationDateOverlay } from './ObservationDateOverlay';
import {
  DraftRouteGeometryLayer,
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
  className?: string;
  width?: string;
  height?: string;
}

export const MapComponent = (
  { className = '', width = '100vw', height = '100vh' }: Props,
  externalRef: Ref<ExplicitAny>,
): JSX.Element => {
  const { t } = useTranslation();

  const routeEditorRef = useRef<ExplicitAny>(null);
  const editorLayerRef = useRef<ExplicitAny>(null);
  const stopsRef = useRef<ExplicitAny>(null);

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

  const onCreateStop = (e: MapLayerMouseEvent) => {
    if (stopsRef.current && drawingMode === undefined) {
      stopsRef.current.onCreateStop(e);
    }
  };

  const onMoveStop = (e: MapLayerMouseEvent) => {
    if (!drawingMode) {
      stopsRef.current?.onMoveStop(e);
    }
  };

  const onClick = (e: MapLayerMouseEvent) => {
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

  return (
    <Maplibre
      width={width}
      height={height}
      onClick={onClick}
      className={className}
    >
      <Stops ref={stopsRef} />
      <CustomOverlay position="top-left">
        <Column className="items-start overflow-hidden p-2">
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
            <RouteStopsOverlay className="mt-2 max-h-[60vh] overflow-hidden" />
          )}
        </Column>
      </CustomOverlay>
      <CustomOverlay position="bottom-right">
        <Column className="items-end p-2">
          {showStopFilterOverlay && <StopFilterOverlay className="mb-2" />}
          <ObservationDateOverlay />
        </Column>
      </CustomOverlay>
      <EditRouteMetadataLayer />
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
        onDeleteDrawnRoute={() => editorLayerRef.current?.onDelete()}
        ref={routeEditorRef}
      />
      <Visible visible={drawingMode !== undefined}>
        <DrawRouteLayer editorRef={editorLayerRef} />
      </Visible>
    </Maplibre>
  );
};

export const Map = React.forwardRef(MapComponent);
