import { Map } from 'maplibre-gl';
import { useCallback } from 'react';
import { MapRef } from 'react-map-gl/dist/esm/mapbox/create-ref';
import {
  extractJourneyPatternCandidateStops,
  getOldRouteGeometryVariables,
  getStopLabelsIncludedInRoute,
  useAppDispatch,
  useAppSelector,
  useExtractRouteFromFeature,
} from '..';
import { useGetRouteDetailsByIdQuery } from '../../generated/graphql';
import {
  selectEditedRouteData,
  selectMapRouteEditor,
  setDraftRouteGeometryAction,
} from '../../redux';
import { log } from '../../utils';
import { addRoute } from '../../utils/map';
import { useFetchInfraLinksWithStops } from './useFetchInfraLinksWithStops';
import { useRouteMetadata } from './useRouteMetadata';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const useRouteGeometryUpdater = (
  map: MapRef<Map> | undefined,
  onDelete: () => void,
) => {
  const dispatch = useAppDispatch();
  const editedRouteData = useAppSelector(selectEditedRouteData);
  const { getRemovedStopLabels } = useExtractRouteFromFeature();

  const routeMetadata = useRouteMetadata();
  const fetchInfraLinksWithStops = useFetchInfraLinksWithStops();
  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
  const baseRouteId = editedRouteData.id || editedRouteData.templateRouteId;

  const baseRouteResult = useGetRouteDetailsByIdQuery({
    skip: !baseRouteId,
    // If baseRouteId is undefined, this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: baseRouteId! },
  });

  const baseRoute = baseRouteResult.data?.route_route_by_pk || undefined;
  return useCallback(
    async (snappingLineFeature) => {
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
        onDelete();
      }
    },
    [
      baseRoute,
      creatingNewRoute,
      routeMetadata,
      fetchInfraLinksWithStops,
      editedRouteData.includedStopLabels,
      editedRouteData.infraLinks,
      getRemovedStopLabels,
      dispatch,
      map,
      onDelete,
    ],
  );
};
