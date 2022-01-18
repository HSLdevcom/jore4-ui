import composeRefs from '@seznam/compose-react-refs';
import debounce from 'lodash/debounce';
import React, {
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { MapContext } from 'react-map-gl';
import { DrawLineStringMode, EditingMode, Editor } from 'react-map-gl-draw';
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
} from '../../graphql/infrastructureNetwork';
import { useAsyncQuery } from '../../hooks';
import { addRoute, removeRoute } from './mapUtils';

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
  const {
    state: { hasRoute },
    dispatch,
  } = useContext(MapEditorContext);

  const onDelete = useCallback(
    (routeId: string) => {
      editorRef.current.deleteFeatures(routeId);
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
    if (hasRoute && mode === Mode.Draw) {
      // allow user to draw only one draft route at once.
      return undefined;
    }
    const modeDetails = modes.find((item) => item.type === mode);
    // eslint-disable-next-line new-cap
    return modeDetails ? new modeDetails.handler() : undefined;
  }, [hasRoute, mode]);

  const [fetchInfraLinksWithStopsByExternalIds] = useAsyncQuery<
    MapExternalLinkIdsToInfraLinksWithStopsQuery,
    MapExternalLinkIdsToInfraLinksWithStopsQueryVariables
  >(MapExternalLinkIdsToInfraLinksWithStopsDocument);

  const onAddRoute = useCallback(
    async (e: EditorCallback) => {
      const addedFeatureIndex = e.data.length - 1;
      const routeId = String(addedFeatureIndex);
      const { coordinates } = e.data[addedFeatureIndex].geometry;

      const routeResponse = await getBusRoute(coordinates);
      dispatch({ type: 'setState', payload: { busRoute: routeResponse } });

      const externalLinkIds = routeResponse.routes[0]?.paths?.map(
        (item) => item.externalLinkRef.externalLinkId,
      );

      // Retrieve the infra links from the external link ids returned by map-matching.
      // This will return the links in arbitrary order.
      const infraLinksWithStopsResponse = await fetchInfraLinksWithStopsByExternalIds(
        {
          externalLinkIds,
        },
      );

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
      const infraLinks: InfrastructureLinkAlongRoute[] = orderedInfraLinksWithStops.map(
        (item, index) => ({
          infrastructureLinkId: item.infrastructure_link_id,
          isTraversalForwards:
            routeResponse.routes[0]?.paths[index]?.traversalForwards,
        }),
      );

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
          infraLinksAlongRoute: infraLinks,
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
    [map, onDelete, dispatch, fetchInfraLinksWithStopsByExternalIds],
  );

  const debouncedOnAddRoute = useMemo(() => debounce(onAddRoute, 500), [
    onAddRoute,
  ]);

  const onUpdate = (e: EditorCallback) => {
    if (e.editType === 'addFeature' || e.editType === 'movePosition') {
      // user added new route or edited existing one
      dispatch({ type: 'setState', payload: { hasRoute: true } });
      // Editor calls onUpdate callback million times when route is being edited. That's why we want to debounce onAddRoute event.
      debouncedOnAddRoute(e);
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

  return (
    <Editor
      style={{
        // This component doesn't support className prop so we have to
        // write styles manually
        cursor: getCursor(),
      }}
      ref={composeRefs(externalRef, editorRef)}
      clickRadius={12}
      mode={modeHandler}
      onUpdate={onUpdate}
    />
  );
};

export const DrawRouteLayer = React.forwardRef<ExplicitAny, Props>(
  DrawRouteLayerComponent,
);
