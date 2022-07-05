import { Feature } from '@nebula.gl/edit-modes';
import composeRefs from '@seznam/compose-react-refs';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
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
  SelectAction,
} from 'react-map-gl-draw';
import {
  ReusableComponentsVehicleModeEnum,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../../generated/graphql';
import {
  getStopsFromRoute,
  mapGraphQLRouteToInfraLinks,
  mapRouteResultToRoute,
  RouteStop,
} from '../../../graphql';
import {
  getRouteStops,
  LineStringFeature,
  mapRouteStopsToStopLabels,
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
  stopRouteEditingAction,
} from '../../../redux';
import { showToast } from '../../../utils';
import { addRoute, removeRoute } from '../mapUtils';
import { featureStyle, handleStyle } from './editorStyles';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

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

const DrawRouteLayerComponent = (
  { mode }: Props,
  externalRef: ExplicitAny,
): JSX.Element => {
  const { map } = useContext(MapContext);
  const editorRef = useRef<ExplicitAny>(null);

  const dispatch = useAppDispatch();
  const { editedRouteData, creatingNewRoute, isRouteMetadataFormOpen } =
    useAppSelector(selectMapEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);

  const { templateRouteId } = editedRouteData;

  // the geojson for the grey line that is used for snapping the draft route to the infra network
  const [snappingLine, setSnappingLine] = useState<LineStringFeature>();

  const [selectedSnapPoints, setSelectedSnapPoints] = useState<number[]>([]);

  const {
    extractScheduledStopPoints,
    getInfraLinksWithStopsForCoordinates,
    mapInfraLinksToFeature,
    getRemovedStopLabels,
  } = useExtractRouteFromFeature();

  const { t } = useTranslation();

  const onDelete = useCallback(
    (routeId: string) => {
      setSnappingLine(undefined);
      removeRoute(map, routeId);
      dispatch(resetDraftRouteGeometryAction());
    },
    [map, dispatch],
  );

  useImperativeHandle(externalRef, () => ({
    onDeleteRoute: () => {
      // currently user can draw only one route, so id of it will always be '0'
      const routeId = '0';
      onDelete(routeId);
    },
  }));

  const modeHandler = useMemo(() => {
    const modeDetails = modes.find((item) => item.type === mode);
    // eslint-disable-next-line new-cap
    return modeDetails ? new modeDetails.handler() : undefined;
  }, [mode]);

  // Fetch existing route's stops and geometry in case editing existing route
  // or creating a new route based on a template route
  const baseRouteId = editedRouteData.id || templateRouteId;
  const baseRouteResult = useGetRoutesWithInfrastructureLinksQuery({
    skip: !baseRouteId,
    variables: { route_ids: baseRouteId ? [baseRouteId] : [] },
  });
  const baseRoute = mapRouteResultToRoute(baseRouteResult);

  const onUpdateRouteGeometry = useCallback(
    async (snappingLineFeature: LineStringFeature) => {
      // we are editing an existing or a template route, but haven't yet received the graphql
      // response with its data -> return early
      if (!baseRoute && !creatingNewRoute) {
        return;
      }

      // retrieve infra links for snapping ling from mapmatching service
      // AND all the related stops nearby
      const { coordinates } = snappingLineFeature.geometry;
      const { infraLinks, orderedInfraLinksWithStops, geometry } =
        await getInfraLinksWithStopsForCoordinates(coordinates);

      // get previous edited state's stops and infra links, to compare journey patterns
      const oldStopLabels = mapRouteStopsToStopLabels(editedRouteData.stops);
      const oldInfraLinks = editedRouteData.infraLinks || [];

      // get the list of stops which have been removed from the journey pattern in previous edits
      const removedStopLabels = await getRemovedStopLabels(
        oldInfraLinks.map((link) => link.infrastructureLinkId),
        oldStopLabels,
      );

      // Extract list of the stops to be included in the route
      const stops = extractScheduledStopPoints({
        orderedInfraLinksWithStops,
        infraLinks,
        vehicleMode: ReusableComponentsVehicleModeEnum.Bus,
      });

      const routeStops = getRouteStops(
        stops,
        removedStopLabels || [],
        editedRouteData?.id,
      );

      dispatch(setDraftRouteGeometryAction({ stops: routeStops, infraLinks }));

      if (geometry) {
        addRoute(map, SNAPPING_LINE_LAYER_ID, geometry);
      } else {
        // map matching backend didn't returned valid route. -> remove
        // also drawn route. Maybe we should show notification to the user
        // when this happens?
        onDelete(SNAPPING_LINE_LAYER_ID);
      }
    },
    [
      baseRoute,
      editedRouteData.id,
      editedRouteData.stops,
      editedRouteData.infraLinks,
      creatingNewRoute,
      getInfraLinksWithStopsForCoordinates,
      getRemovedStopLabels,
      extractScheduledStopPoints,
      dispatch,
      map,
      onDelete,
    ],
  );

  // Initializing snapping line
  useEffect(() => {
    // If creating new route (without a template) or snapping line already exists,
    // no need to initialize snapping line
    if ((creatingNewRoute && !templateRouteId) || snappingLine) {
      return;
    }

    if (mode === Mode.Edit && baseRoute) {
      // Starting to edit a route, generate snapping line from infra links
      const infraLinks = mapGraphQLRouteToInfraLinks(baseRoute);
      const infraSnappingLine = mapInfraLinksToFeature(infraLinks);

      setSnappingLine(infraSnappingLine);
      onUpdateRouteGeometry(infraSnappingLine);
    } else {
      // If not drawing or editing, clear snapping line
      setSnappingLine(undefined);
    }
  }, [
    mapInfraLinksToFeature,
    onUpdateRouteGeometry,
    mode,
    creatingNewRoute,
    dispatch,
    baseRoute,
    snappingLine,
    templateRouteId,
  ]);

  const debouncedOnAddRoute = useMemo(
    () => debounce(onUpdateRouteGeometry, 500),
    [onUpdateRouteGeometry],
  );

  const onUpdate = (e: EditorCallback) => {
    if (!e.data || e.data.length !== 1) {
      // we are still in the middle of creating the snapping line
      return;
    }
    const snappingLineFeature = e.data[0] as LineStringFeature;

    setSnappingLine(snappingLineFeature);
    if (e.editType === 'addFeature' || e.editType === 'movePosition') {
      // Editor calls onUpdate callback million times when route is being edited. That's why we want to debounce onAddRoute event.
      debouncedOnAddRoute(snappingLineFeature);

      if (e.editType === 'addFeature') {
        dispatch(stopRouteEditingAction());
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
        !isRouteMetadataFormOpen &&
        snappingLine &&
        (event.key === 'Backspace' || event.key === 'Delete')
      ) {
        const coordinates = snappingLine.geometry
          .coordinates as GeoJSON.Position[];

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

        setSnappingLine({
          ...snappingLine,
          geometry: { type: 'LineString', coordinates },
        });
        setSelectedSnapPoints([]);

        debouncedOnAddRoute(snappingLine);
      }
    },
    [
      isRouteMetadataFormOpen,
      snappingLine,
      selectedSnapPoints,
      debouncedOnAddRoute,
      t,
    ],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);

    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [keyDown]);

  // initialize stop and infra link data from base route if we don't yet have edited data
  useEffect(() => {
    if ((!editedRouteData.stops || !editedRouteData.infraLinks) && baseRoute) {
      const stopsInJourneyPattern = getStopsFromRoute(baseRoute);
      const infraLinks = mapGraphQLRouteToInfraLinks(baseRoute);

      const routeStops: RouteStop[] = stopsInJourneyPattern.map((item) => ({
        label: item.scheduled_stop_point_label,
        belongsToJourneyPattern: true,
        stop: item,
      }));

      dispatch(setDraftRouteGeometryAction({ stops: routeStops, infraLinks }));
    }
  }, [dispatch, editedRouteData.stops, editedRouteData.infraLinks, baseRoute]);

  const onFeatureSelected = ({
    selectedEditHandleIndex: selectedIndex,
  }: SelectAction) => {
    // only snap point features have a handle, not interested in other features
    if (isNil(selectedIndex)) {
      return;
    }

    // toggle selection when snap point is clicked
    const newSelection = selectedSnapPoints.includes(selectedIndex)
      ? selectedSnapPoints.filter((item) => item !== selectedIndex) // unselect
      : [...selectedSnapPoints, selectedIndex]; // select

    setSelectedSnapPoints(newSelection);
  };

  const mapSnappingLineToRenderedFeatures = (snapLine?: LineStringFeature) =>
    // the GeoJSON and react-map-gl-draw Feature types are not fully compatible
    (snapLine ? [snapLine] : []) as Feature[];

  // this renders the grey snapping line + snapping points that appear when creating or editing a route
  return (
    <Editor
      style={{
        // This component doesn't support className prop so we have to
        // write styles manually
        cursor: getCursor(),
      }}
      featureStyle={featureStyle}
      ref={composeRefs(externalRef, editorRef)}
      clickRadius={24}
      mode={modeHandler}
      onUpdate={onUpdate}
      features={mapSnappingLineToRenderedFeatures(snappingLine)}
      featuresDraggable={false}
      selectable
      onSelect={onFeatureSelected}
      editHandleStyle={handleStyle(selectedSnapPoints)}
    />
  );
};

export const DrawRouteLayer = React.forwardRef<ExplicitAny, Props>(
  DrawRouteLayerComponent,
);
