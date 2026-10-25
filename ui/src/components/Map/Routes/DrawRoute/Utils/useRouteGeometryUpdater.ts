import { gql, useApolloClient } from '@apollo/client';
import { useCallback, useEffect, useRef } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import {
  GetStopsAlongInfrastructureLinksDocument,
  GetStopsAlongInfrastructureLinksQuery,
  GetStopsAlongInfrastructureLinksQueryVariables,
  InfrastructureLinkAllFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
  StopWithJourneyPatternFieldsFragment,
  useGetRouteDetailsByIdQuery,
} from '../../../../../generated/graphql';
import {
  Mode,
  selectEditedRouteData,
  selectMapRouteEditor,
  setDraftRouteGeometryAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../../redux';
import { RouteInfraLink } from '../../../../../types';
import { log } from '../../../../../utils';
import { extractJourneyPatternCandidateStops } from '../../../../LinesAndRoutes/Common';
import {
  SNAPPING_LINE_LAYER_ID,
  addRoute,
  getRouteStopLabels,
} from '../../Utils';
import { LineStringFeature } from '../types';
import { mapRouteToInfraLinksAlongRoute } from './infraLinkMappers';
import { useFetchInfraLinksWithStops } from './useFetchInfraLinksWithStops';
import { useRouteMetadata } from './useRouteMetadata';

const GQL_GET_STOPS_ALONG_INFRASTRUCTURE_LINKS = gql`
  query GetStopsAlongInfrastructureLinks($infrastructure_link_ids: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: {
        located_on_infrastructure_link_id: { _in: $infrastructure_link_ids }
      }
    ) {
      ...ScheduledStopPointAllFields
    }
  }
`;

type EditorStateSnapshot = {
  readonly creatingNewRoute: boolean;
  readonly drawingMode: Mode | undefined;
  readonly suppressBaseRouteRehydrate: boolean;
  readonly hasDraftGeometry: boolean;
};

function canApplyResolvedGeometryUpdate(
  editorState: EditorStateSnapshot,
  startedInCreationFlow: boolean,
) {
  if (editorState.creatingNewRoute) {
    return true;
  }

  if (editorState.drawingMode !== Mode.Edit) {
    return false;
  }

  return (
    !editorState.suppressBaseRouteRehydrate ||
    startedInCreationFlow ||
    editorState.hasDraftGeometry
  );
}

function getOldRouteGeometryVariables(
  previouslyEditedStopLabels: ReadonlyArray<string>,
  stateInfraLinks:
    | ReadonlyArray<RouteInfraLink<InfrastructureLinkAllFieldsFragment>>
    | undefined,
  baseRoute?: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
) {
  const previouslyEditedRouteInfrastructureLinks = stateInfraLinks ?? [];

  // If we are editing existing route and it has not been edited yet,
  // extract and return stops and infra links from the original route
  if (
    (!previouslyEditedStopLabels.length ||
      !previouslyEditedRouteInfrastructureLinks.length) &&
    baseRoute
  ) {
    return {
      oldStopLabels: getRouteStopLabels(baseRoute),
      oldInfraLinks: mapRouteToInfraLinksAlongRoute(baseRoute),
    };
  }

  // If route has been edited, return edited route's stops and infra links
  return {
    oldStopLabels: previouslyEditedStopLabels,
    oldInfraLinks: previouslyEditedRouteInfrastructureLinks,
  };
}

/**
 * Get RouteStops for stops along route geometry
 * @param stops List of stops along route geometry
 * @param removedStopLabels List of stop labels that have been removed from the route
 * @returns List of RouteStops
 */
function getStopLabelsIncludedInRoute<
  TStop extends StopWithJourneyPatternFieldsFragment,
>(
  stops: ReadonlyArray<TStop>,
  removedStopLabels?: ReadonlyArray<string>,
): string[] {
  return stops
    .filter((item) => !removedStopLabels?.includes(item.label))
    .map((item) => item.label);
}

function useGetRemovedStopLabels() {
  const apollo = useApolloClient();

  return useCallback(
    async (
      infrastructureLinkIds: ReadonlyArray<UUID>,
      currentStopLabels: ReadonlyArray<string>,
    ) => {
      const { data } = await apollo.query<
        GetStopsAlongInfrastructureLinksQuery,
        GetStopsAlongInfrastructureLinksQueryVariables
      >({
        query: GetStopsAlongInfrastructureLinksDocument,
        variables: { infrastructure_link_ids: infrastructureLinkIds },
      });

      return data.service_pattern_scheduled_stop_point
        .map((item) => item.label)
        .filter((stop) => !currentStopLabels.includes(stop));
    },
    [apollo],
  );
}

export function useRouteGeometryUpdater(
  map: MapRef | undefined,
  removeSnappingLine: () => void,
  onDrawGeometryRejected?: () => void,
) {
  const dispatch = useAppDispatch();
  const editedRouteData = useAppSelector(selectEditedRouteData);
  const getRemovedStopLabels = useGetRemovedStopLabels();

  const routeMetadata = useRouteMetadata();
  const fetchInfraLinksWithStops = useFetchInfraLinksWithStops();
  const { creatingNewRoute, drawingMode, suppressBaseRouteRehydrate } =
    useAppSelector(selectMapRouteEditor);
  const hasDraftGeometry = !!editedRouteData.geometry;
  const baseRouteId = editedRouteData.id ?? editedRouteData.templateRouteId;
  const editorStateRef = useRef<EditorStateSnapshot>({
    creatingNewRoute,
    drawingMode,
    suppressBaseRouteRehydrate,
    hasDraftGeometry,
  });

  useEffect(() => {
    editorStateRef.current = {
      creatingNewRoute,
      drawingMode,
      suppressBaseRouteRehydrate,
      hasDraftGeometry,
    };
  }, [
    creatingNewRoute,
    drawingMode,
    hasDraftGeometry,
    suppressBaseRouteRehydrate,
  ]);

  const baseRouteResult = useGetRouteDetailsByIdQuery({
    skip: !baseRouteId,
    // If baseRouteId is undefined, this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: baseRouteId! },
  });

  const baseRoute = baseRouteResult.data?.route_route_by_pk ?? undefined;
  return useCallback(
    async (
      snappingLineFeature: LineStringFeature,
      // Preserve the mode at draw time when a debounced call runs after a transition.
      startedInCreationFlowAtDrawTime?: boolean,
    ) => {
      const startedInCreationFlow =
        startedInCreationFlowAtDrawTime ??
        (creatingNewRoute || drawingMode === Mode.Draw);

      if (!baseRoute && !creatingNewRoute) {
        log.warn(
          'Trying to edit an existing route but could not find a base route (yet)',
        );
        return;
      }

      if (!routeMetadata) {
        log.warn(
          'Trying to update route geometry but route metadata is not (yet) available',
        );
        return;
      }

      const response = await fetchInfraLinksWithStops(
        snappingLineFeature.geometry,
      );
      if (!response) {
        if (startedInCreationFlow) {
          removeSnappingLine();
          onDrawGeometryRejected?.();
        }
        return;
      }

      const { infraLinksWithStops, matchedGeometry } = response;
      const { oldStopLabels, oldInfraLinks } = getOldRouteGeometryVariables(
        editedRouteData.includedStopLabels,
        editedRouteData.infraLinks,
        baseRoute,
      );

      const removedStopLabels = await getRemovedStopLabels(
        oldInfraLinks.map((link) => link.infrastructure_link_id),
        oldStopLabels,
      );

      const stopsEligibleForJourneyPattern =
        extractJourneyPatternCandidateStops(infraLinksWithStops, routeMetadata);
      const includedStopLabels = getStopLabelsIncludedInRoute(
        stopsEligibleForJourneyPattern,
        removedStopLabels,
      );

      // Read current state after awaits so canceled flows cannot apply stale results.
      const currentEditorState = editorStateRef.current;
      // Allow active edits and in-flight redraws, but reject callbacks after exiting.
      const canApplyGeometryUpdate = canApplyResolvedGeometryUpdate(
        currentEditorState,
        startedInCreationFlow,
      );
      if (!canApplyGeometryUpdate) {
        // Discard stale geometry and its temporary map layer.
        removeSnappingLine();
        return;
      }

      dispatch(
        setDraftRouteGeometryAction({
          includedStopLabels,
          stopsEligibleForJourneyPattern,
          infraLinks: infraLinksWithStops,
          geometry: matchedGeometry,
        }),
      );

      if (matchedGeometry && map) {
        addRoute(map.getMap(), SNAPPING_LINE_LAYER_ID, matchedGeometry);
      } else {
        removeSnappingLine();
      }
    },
    [
      baseRoute,
      creatingNewRoute,
      drawingMode,
      routeMetadata,
      fetchInfraLinksWithStops,
      editedRouteData.includedStopLabels,
      editedRouteData.infraLinks,
      getRemovedStopLabels,
      dispatch,
      map,
      onDrawGeometryRejected,
      removeSnappingLine,
    ],
  );
}
