import { Feature } from '@nebula.gl/edit-modes';
import composeRefs from '@seznam/compose-react-refs';
import debounce from 'lodash/debounce';
import remove from 'lodash/remove';
import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MapContext } from 'react-map-gl';
import {
  DrawLineStringMode,
  EditingMode,
  Editor,
  RENDER_STATE,
} from 'react-map-gl-draw';
import {
  ReusableComponentsVehicleModeEnum,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../../generated/graphql';
import {
  mapGraphQLRouteToInfraLinks,
  mapRoutesDetailsResult,
} from '../../../graphql';
import {
  getRouteStops,
  LineStringFeature,
  useAppDispatch,
  useAppSelector,
  useExtractRouteFromFeature,
} from '../../../hooks';
import {
  Mode,
  resetDraftRouteGeometryAction,
  selectHasDraftRouteGeometry,
  selectMapEditor,
  setDraftRouteGeometryAction,
  stopEditRouteAction,
} from '../../../redux';
import { showToast } from '../../../utils';
import { addRoute, removeRoute } from '../mapUtils';

interface Props {
  mode?: Mode;
}

const modes = [
  { type: Mode.Draw, handler: DrawLineStringMode },
  { type: Mode.Edit, handler: EditingMode },
];

interface EditorCallback {
  data: ExplicitAny[];
  editType: 'addTentativePosition' | 'addFeature' | 'movePosition'; // NOTE: there are no guarantees that this list is complete :)
  editContext: ExplicitAny;
  selectedFeatureIndex: number;
}

// `react-map-gl-draw` library can't be updated into latest version
// until following issue is resolved. Otherwise editing won't work.
// https://github.com/uber/nebula.gl/issues/580
// Latest version of `react-map-gl-draw` doesn't seem to have peer dependencies,
// but v0.21.1 seems to require to have `@turf/area` dependency installed.

const DrawRouteLayerComponent = (
  { mode }: Props,
  externalRef: ExplicitAny,
): JSX.Element => {
  const { map } = useContext(MapContext);
  const editorRef = useRef<ExplicitAny>(null);

  const dispatch = useAppDispatch();
  const { editedRouteData, creatingNewRoute } = useAppSelector(selectMapEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);

  const { templateRouteId } = editedRouteData;

  const [routeFeatures, setRouteFeatures] = useState<LineStringFeature[]>([]);
  const [selectedSnapPoints, setSelectedSnapPoints] = useState<number[]>([]);

  const {
    extractScheduledStopPointIds,
    extractCoordinatesFromFeatures,
    getInfraLinksWithStopsForCoordinates,
    mapInfraLinksToFeature,
    getRemovedStopIds,
    getOldRouteGeometryVariables,
  } = useExtractRouteFromFeature();

  const { t } = useTranslation();

  const onDelete = useCallback(
    (routeId: string) => {
      setRouteFeatures([]);
      removeRoute(map, routeId);
      dispatch(resetDraftRouteGeometryAction());
    },
    [map, dispatch],
  );

  useImperativeHandle(externalRef, () => ({
    onDeleteRoute: () => {
      if (hasDraftRouteGeometry) {
        // currently user can draw only one route, so id of it will always be '0'
        const routeId = '0';
        onDelete(routeId);
      }
    },
  }));

  const modeHandler = useMemo(() => {
    const modeDetails = modes.find((item) => item.type === mode);
    // eslint-disable-next-line new-cap
    return modeDetails ? new modeDetails.handler() : undefined;
  }, [mode]);

  const baseGeometryRouteId = editedRouteData.id || templateRouteId;

  // Fetch existing route's geometry in case editing existing route
  // or creating a new route based on a template route
  const routesResult = useGetRoutesWithInfrastructureLinksQuery({
    skip: !baseGeometryRouteId,
    variables: { route_ids: baseGeometryRouteId ? [baseGeometryRouteId] : [] },
  });

  const routes = mapRoutesDetailsResult(routesResult);

  const onUpdateRouteGeometry = useCallback(
    async (newFeatures: LineStringFeature[]) => {
      if ((!routes || editedRouteData.id === undefined) && !creatingNewRoute) {
        return;
      }

      const { coordinates, routeId } =
        extractCoordinatesFromFeatures(newFeatures);

      const { infraLinks, orderedInfraLinksWithStops, geometry } =
        await getInfraLinksWithStopsForCoordinates(coordinates);

      const { oldStopIds, oldInfraLinks } = getOldRouteGeometryVariables(
        editedRouteData.stops,
        editedRouteData.infraLinks,
        routes,
        !creatingNewRoute || !!templateRouteId,
      );

      const removedStopIds = await getRemovedStopIds(
        oldInfraLinks.map((link) => link.infrastructureLinkId),
        oldStopIds,
      );

      // Extract the list of ids of the stops to be included in the route
      const stopIds = extractScheduledStopPointIds({
        orderedInfraLinksWithStops,
        infraLinks,
        vehicleMode: ReusableComponentsVehicleModeEnum.Bus,
      });

      const stops = getRouteStops(stopIds, removedStopIds || []);

      dispatch(setDraftRouteGeometryAction({ stops, infraLinks }));

      if (stops.filter((item) => item.belongsToRoute).length >= 2) {
        // eslint-disable-next-line no-console
        console.log(
          'Route goes along 2 or more stops and thus can be saved. TODO: show user UI to select which stops to use.',
        );
      } else {
        // eslint-disable-next-line no-console
        console.log(
          'There were less than 2 stops within route. Route needs at least starting stop and final stop. TODO: inform user about this.',
        );
      }

      if (geometry) {
        addRoute(map, routeId, geometry);
      } else {
        // map matching backend didn't returned valid route. -> remove
        // also drawn route. Maybe we should show notification to the user
        // when this happens?
        onDelete(routeId);
      }
    },
    [
      routes,
      editedRouteData,
      creatingNewRoute,
      extractCoordinatesFromFeatures,
      getInfraLinksWithStopsForCoordinates,
      getOldRouteGeometryVariables,
      templateRouteId,
      getRemovedStopIds,
      extractScheduledStopPointIds,
      dispatch,
      map,
      onDelete,
    ],
  );

  // Update features if needed
  useEffect(() => {
    // If creating new route (without a template) or features already exist,
    // no need to get new features
    if ((creatingNewRoute && !templateRouteId) || routeFeatures?.length !== 0) {
      return;
    }

    if (mode === Mode.Edit && routes && routes[0]) {
      // Starting to edit a route, generate features from infra links
      const infraLinks = mapGraphQLRouteToInfraLinks(routes[0]);
      const newFeatures = [mapInfraLinksToFeature(infraLinks)];

      setRouteFeatures(newFeatures);
      onUpdateRouteGeometry(newFeatures);
    } else {
      // If not drawing or editing, clear features
      setRouteFeatures([]);
    }
  }, [
    mapInfraLinksToFeature,
    onUpdateRouteGeometry,
    mode,
    creatingNewRoute,
    dispatch,
    routes,
    routeFeatures?.length,
    templateRouteId,
  ]);

  const debouncedOnAddRoute = useMemo(
    () => debounce(onUpdateRouteGeometry, 500),
    [onUpdateRouteGeometry],
  );

  const onUpdate = (e: EditorCallback) => {
    setRouteFeatures(e.data);
    if (e.editType === 'addFeature' || e.editType === 'movePosition') {
      // Editor calls onUpdate callback million times when route is being edited. That's why we want to debounce onAddRoute event.
      debouncedOnAddRoute(e.data);

      if (e.editType === 'addFeature') {
        dispatch(stopEditRouteAction());
      }
    }
  };

  const getCursor = () => {
    switch (mode) {
      case Mode.Draw:
        return hasDraftRouteGeometry ? 'not-allowed' : 'crosshair';
      case Mode.Edit:
        return 'grab';
      default:
        return undefined;
    }
  };

  const keyDown = useCallback(
    (event) => {
      if (
        routeFeatures &&
        routeFeatures.length > 0 &&
        (event.key === 'Backspace' || event.key === 'Delete')
      ) {
        const feature = routeFeatures[0];
        const coordinates = feature.geometry.coordinates as GeoJSON.Position[];

        if (coordinates.length - selectedSnapPoints.length < 2) {
          showToast({
            type: 'danger',
            message: t('errors.leaveMultipleHandles'),
          });

          return;
        }

        remove(coordinates, (element: GeoJSON.Position, index: number) =>
          selectedSnapPoints.includes(index),
        );

        setRouteFeatures([
          { ...feature, geometry: { type: 'LineString', coordinates } },
        ]);
        setSelectedSnapPoints([]);

        debouncedOnAddRoute(routeFeatures);
      }
    },
    [routeFeatures, selectedSnapPoints, debouncedOnAddRoute, t],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);

    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [keyDown]);

  const handleStyle = ({
    state,
    index,
  }: {
    state: RENDER_STATE;
    index: number;
  }) => {
    if (state === RENDER_STATE.HOVERED) {
      return {
        stroke: 'green',
      };
    }
    if (selectedSnapPoints.includes(index)) {
      return {
        stroke: 'red',
      };
    }
    return {
      stroke: 'green',
      strokeDasharray: '4,3',
    };
  };

  return (
    <Editor
      style={{
        // This component doesn't support className prop so we have to
        // write styles manually
        cursor: getCursor(),
      }}
      ref={composeRefs(externalRef, editorRef)}
      clickRadius={20}
      mode={modeHandler}
      onUpdate={onUpdate}
      features={routeFeatures as Feature[]}
      featuresDraggable={false}
      selectable
      onSelect={({
        selectedEditHandleIndex,
      }: {
        selectedEditHandleIndex: number;
      }) => {
        if (selectedEditHandleIndex === null) {
          return;
        }

        if (selectedSnapPoints.includes(selectedEditHandleIndex)) {
          setSelectedSnapPoints(
            selectedSnapPoints.filter(
              (handle) => handle !== selectedEditHandleIndex,
            ),
          );
        } else {
          setSelectedSnapPoints([
            ...selectedSnapPoints,
            selectedEditHandleIndex,
          ]);
        }
      }}
      editHandleStyle={handleStyle}
    />
  );
};

export const DrawRouteLayer = React.forwardRef<ExplicitAny, Props>(
  DrawRouteLayerComponent,
);
