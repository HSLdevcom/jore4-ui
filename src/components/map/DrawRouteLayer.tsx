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
import { getBusRoute } from '../../api/routing';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import {
  MapExternalLinkIdsToInfraLinksWithStopsDocument,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  MapExternalLinkIdsToInfraLinksWithStopsQueryVariables,
  ReusableComponentsVehicleModeEnum,
} from '../../generated/graphql';
import {
  extractScheduledStopPointIds,
  InfrastructureLinkAlongRoute,
  orderInfraLinksByExternalLinkId,
} from '../../graphql';
import { useAsyncQuery } from '../../hooks';
import { mapGeoJSONtoFeature, showToast } from '../../utils';
import { addRoute, removeRoute } from './mapUtils';

type LineStringFeature = GeoJSON.Feature<GeoJSON.LineString>;

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

const mapInfraLinksToFeatures = (
  infraLinks: InfrastructureLinkAlongRoute[] | undefined,
): LineStringFeature[] => {
  if (!infraLinks || infraLinks.length === 0) return [];
  const coordinates: GeoJSON.Position[] = infraLinks.flatMap((link, index) => {
    const isFirst = index === 0;
    let linkCoordinates = link.shape.coordinates;

    // Order coordinates properly
    if (linkCoordinates.length > 0 && !link.isTraversalForwards) {
      linkCoordinates = [...linkCoordinates].reverse();
    }

    // To simplify the path drawn,
    // remove points in the middle of the infrastructure link
    const firstPoint = linkCoordinates[0];
    const lastPoint = linkCoordinates[linkCoordinates.length - 1];

    const pointsToDraw = isFirst ? [firstPoint, lastPoint] : [lastPoint];

    // Remove z-coordinate
    return pointsToDraw.map(
      (coordinate: number[]) => coordinate.slice(0, 2) as GeoJSON.Position,
    );
  });

  return [mapGeoJSONtoFeature({ type: 'LineString', coordinates })];
};

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
  const {
    state: { hasRoute, infraLinksAlongRoute, editingRouteId },
    dispatch,
  } = useContext(MapEditorContext);

  const [routeFeatures, setRouteFeatures] = useState<LineStringFeature[]>();
  const [selectedSnapPoints, setSelectedSnapPoints] = useState<number[]>([]);

  const { t } = useTranslation();

  const onDelete = useCallback(
    (routeId: string) => {
      setRouteFeatures([]);
      removeRoute(map, routeId);
      dispatch({ type: 'setState', payload: { hasRoute: false } });
    },
    [map, dispatch],
  );

  useImperativeHandle(externalRef, () => ({
    onDeleteRoute: () => {
      if (hasRoute) {
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

  const [fetchInfraLinksWithStopsByExternalIds] = useAsyncQuery<
    MapExternalLinkIdsToInfraLinksWithStopsQuery,
    MapExternalLinkIdsToInfraLinksWithStopsQueryVariables
  >(MapExternalLinkIdsToInfraLinksWithStopsDocument);

  const onUpdateRouteGeometry = useCallback(
    async (newFeatures: LineStringFeature[]) => {
      // user added new route or edited existing one
      dispatch({ type: 'setState', payload: { hasRoute: true } });

      if (editingRouteId === undefined) {
        return;
      }

      const addedFeatureIndex = newFeatures.length - 1;
      const routeId = String(addedFeatureIndex);
      const { coordinates } = newFeatures[addedFeatureIndex].geometry;

      const routeResponse = await getBusRoute(
        coordinates as GeoJSON.Position[],
      );
      dispatch({ type: 'setState', payload: { busRoute: routeResponse } });

      const externalLinkIds = routeResponse.routes[0]?.paths?.map(
        (item) => item.externalLinkRef.externalLinkId,
      );

      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse =
        await fetchInfraLinksWithStopsByExternalIds({
          externalLinkIds,
        });

      const infraLinksWithStops =
        infraLinksWithStopsResponse.data
          ?.infrastructure_network_infrastructure_link;

      if (!infraLinksWithStops) {
        // eslint-disable-next-line no-console
        console.log("could not fetch route's infra links");
        return;
      }

      // Order the infra links to match the order of the route returned by map-matching
      const orderedInfraLinksWithStops = orderInfraLinksByExternalLinkId(
        infraLinksWithStops,
        externalLinkIds,
      );

      // Create the list of links used for route creation
      const infraLinks: InfrastructureLinkAlongRoute[] =
        orderedInfraLinksWithStops.map((item, index) => ({
          infrastructureLinkId: item.infrastructure_link_id,
          isTraversalForwards:
            routeResponse.routes[0]?.paths[index]?.isTraversalForwards,
          shape: item.shape,
        }));

      // Extract the list of ids of the stops to be included in the route
      const stopIds = extractScheduledStopPointIds(
        orderedInfraLinksWithStops,
        infraLinks,
        ReusableComponentsVehicleModeEnum.Bus,
      );

      dispatch({
        type: 'setState',
        payload: {
          stopIdsWithinRoute: stopIds,
          infraLinksAlongRoute: new Map(infraLinksAlongRoute).set(
            editingRouteId,
            infraLinks,
          ),
        },
      });

      if (stopIds.length >= 2) {
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

      if (routeResponse?.routes?.[0]?.geometry) {
        addRoute(map, routeId, routeResponse.routes[0].geometry);
      } else {
        // map matching backend didn't returned valid route. -> remove
        // also drawn route. Maybe we should show notification to the user
        // when this happens?
        onDelete(routeId);
      }
    },
    // TODO: Why does adding fetchInfraLinksWithStopsByExternalIds to his array result in
    // debounce not working (callback being generated again)?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map, onDelete, dispatch, infraLinksAlongRoute, editingRouteId],
  );

  useEffect(() => {
    if (editingRouteId) {
      const newFeatures = mapInfraLinksToFeatures(
        infraLinksAlongRoute?.get(editingRouteId),
      );

      setRouteFeatures(newFeatures);

      if (newFeatures?.length !== 0) {
        onUpdateRouteGeometry(newFeatures);
      }
    } else {
      setRouteFeatures([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingRouteId]);

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
        dispatch({
          type: 'setState',
          payload: { drawingMode: undefined },
        });
      }
    }
  };

  const getCursor = () => {
    switch (mode) {
      case Mode.Draw:
        return hasRoute ? 'not-allowed' : 'crosshair';
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
