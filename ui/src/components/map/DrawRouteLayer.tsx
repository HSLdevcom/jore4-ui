import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useGetRouteDetailsByIdQuery } from '../../generated/graphql';
import { mapRouteToInfraLinksAlongRoute } from '../../graphql';
import {
  LineStringFeature,
  extractJourneyPatternCandidateStops,
  getOldRouteGeometryVariables,
  getStopLabelsIncludedInRoute,
  mapInfraLinksToFeature,
  useAppDispatch,
  useAppSelector,
  useExtractRouteFromFeature,
  useLoader,
} from '../../hooks';
import {
  Mode,
  Operation,
  resetDraftRouteGeometryAction,
  selectEditedRouteData,
  selectMapRouteEditor,
  setDraftRouteGeometryAction,
  stopRouteEditingAction,
} from '../../redux';
import { parseDate } from '../../time';
import { MapMatchingNoSegmentError, log, showDangerToast } from '../../utils';
import { addRoute, removeRoute } from '../../utils/map';
import { DrawControl } from './DrawControl';

const SNAPPING_LINE_LAYER_ID = 'snapping-line';

interface Props {
  editorRef: Ref<ExplicitAny>;
}

export const DrawRouteLayer = ({ editorRef }: Props) => {
  const drawRef = useRef<MapboxDraw | null>(null);
  const { current: mapRef } = useMap();

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { setIsLoading } = useLoader(Operation.LoadMap);

  const [snappingLine, setSnappingLine] = useState<LineStringFeature>();

  const editedRouteData = useAppSelector(selectEditedRouteData);
  const { drawingMode } = useAppSelector(selectMapRouteEditor);
  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);

  const { getInfraLinksWithStopsForGeometry, getRemovedStopLabels } =
    useExtractRouteFromFeature();

  const { templateRouteId } = editedRouteData;
  // Fetch existing route's stops and geometry in case editing existing route
  // or creating a new route based on a template route

  const baseRouteId = editedRouteData.id || templateRouteId;

  const baseRouteResult = useGetRouteDetailsByIdQuery({
    skip: !baseRouteId,
    // If baseRouteId is undefined, this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: baseRouteId! },
  });

  const baseRoute = baseRouteResult.data?.route_route_by_pk || undefined;

  const onDelete = useCallback(() => {
    setSnappingLine(undefined);
    if (mapRef) {
      removeRoute(mapRef.getMap(), SNAPPING_LINE_LAYER_ID);
      dispatch(resetDraftRouteGeometryAction());
    }
  }, [dispatch, mapRef]);

  const onUpdateRouteGeometry = useCallback(
    async (snappingLineFeature: LineStringFeature) => {
      // we are editing an existing or a template route, but haven't (yet) received the graphql
      // response with its data -> return early
      if (!baseRoute && !creatingNewRoute) {
        log.warn(
          'Trying to edit an existing route but could not find a base route (yet)',
        );
        return;
      }

      // we can only find the stops belonging to the route if its metadata is available
      // (when editing, fetch it from graphql; when creating, filled in through form)
      if (
        !editedRouteData.metaData ||
        editedRouteData.metaData.validityStart === undefined ||
        editedRouteData.metaData.validityEnd === undefined ||
        editedRouteData.metaData.priority === undefined
      ) {
        log.warn(
          'Trying to update route geometry but route metadata is not (yet) available',
        );
        return;
      }

      // retrieve infra links with stops for snapping line from mapmatching service
      const { geometry } = snappingLineFeature;

      setIsLoading(true);
      let infraLinksWithStops;
      let matchedGeometry;
      try {
        const response = await getInfraLinksWithStopsForGeometry(geometry);
        infraLinksWithStops = response.infraLinksWithStops;
        matchedGeometry = response.matchedGeometry;
      } catch (err) {
        if (err instanceof MapMatchingNoSegmentError) {
          showDangerToast(t('errors.tooFarFromInfrastructureLink'));
        } else {
          throw err;
        }
      } finally {
        setIsLoading(false);
      }

      if (!infraLinksWithStops) return;

      // retrieve stop and infra link data from base route if we don't yet have edited data
      // TODO: this should happen only once, not every time the snapping line is updated
      const { oldStopLabels, oldInfraLinks } = getOldRouteGeometryVariables(
        editedRouteData.includedStopLabels,
        editedRouteData.infraLinks,
        baseRoute,
      );

      const removedStopLabels = await getRemovedStopLabels(
        oldInfraLinks.map((link) => link.infrastructure_link_id),
        oldStopLabels,
      );

      // Extract list of the stops that are eligible to be included in route's journey pattern
      const routeMetadata = {
        validity_start: parseDate(editedRouteData.metaData.validityStart),
        validity_end: parseDate(editedRouteData.metaData.validityEnd),
        priority: editedRouteData.metaData.priority,
      };
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
      if (matchedGeometry && mapRef) {
        addRoute(mapRef.getMap(), SNAPPING_LINE_LAYER_ID, matchedGeometry);
      } else {
        // map matching backend didn't returned valid route. -> remove
        // also drawn route. Maybe we should show notification to the user
        // when this happens?
        onDelete();
      }
    },
    [
      baseRoute,
      creatingNewRoute,
      dispatch,
      editedRouteData,
      getInfraLinksWithStopsForGeometry,
      getRemovedStopLabels,
      mapRef, 
      onDelete,
      setIsLoading,
      t,
    ],
  );

  const debouncedOnAddRoute = useMemo(
    () => debounce(onUpdateRouteGeometry, 500),
    [onUpdateRouteGeometry],
  );

  // Initializing snapping line
  useEffect(() => {
    // If creating new route (without a template) or snapping line already exists,
    // no need to initialize snapping line
    if (snappingLine) {
      return;
    }
    if (
      creatingNewRoute &&
      !templateRouteId &&
      editedRouteData.infraLinks &&
      !isEmpty(editedRouteData.infraLinks)
    ) {
      const infraSnappingLine = mapInfraLinksToFeature(
        editedRouteData.infraLinks,
      );
      setSnappingLine(infraSnappingLine);
      drawRef.current?.add({
        id: SNAPPING_LINE_LAYER_ID,
        ...infraSnappingLine,
      });
      drawRef.current?.changeMode('direct_select', {
        featureId: SNAPPING_LINE_LAYER_ID,
      });
    }

    if (drawingMode === Mode.Edit && baseRoute) {
      // Starting to edit a route, generate snapping line from infra links
      const infraLinks = mapRouteToInfraLinksAlongRoute(baseRoute);
      const infraSnappingLine = mapInfraLinksToFeature(infraLinks);
      setSnappingLine(infraSnappingLine);
      debouncedOnAddRoute(infraSnappingLine);

      drawRef.current?.add({
        id: SNAPPING_LINE_LAYER_ID,
        ...infraSnappingLine,
      });
      drawRef.current?.changeMode('direct_select', {
        featureId: SNAPPING_LINE_LAYER_ID,
      });
    } else {
      // If not drawing or editing, clear snapping line
      setSnappingLine(undefined);
    }
  }, [
    baseRoute,
    creatingNewRoute,
    debouncedOnAddRoute,
    drawingMode,
    editedRouteData.infraLinks,
    onUpdateRouteGeometry,
    snappingLine,
    templateRouteId,
  ]);

  const keyDown = useCallback((event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      drawRef.current?.trash();
    }
  }, []);

  useImperativeHandle(editorRef, () => ({
    onDelete,
  }));

  useEffect(() => {
    document.addEventListener('keydown', keyDown, false);

    return () => {
      document.removeEventListener('keydown', keyDown, false);
    };
  }, [keyDown]);

  // If we don't have metadata, we should not render <DrawControl>
  // useControl hook inside <DrawControl> do not rerender correctly and have an incorrect state
  if (!editedRouteData.metaData) {
    return null;
  }

  const onCreate = (e: { features: object[] }) => {
    if (!e.features || e.features.length !== 1) {
      // we are still in the middle of creating the snapping line
      return;
    }
    const snappingLineFeature = e.features[0] as LineStringFeature;
    setSnappingLine(snappingLineFeature);
    debouncedOnAddRoute(snappingLineFeature);

    dispatch(stopRouteEditingAction());
  };

  const onUpdate = (e: { features: object[]; action: string }) => {
    if (!e.features || e.features.length !== 1) {
      // we are still in the middle of creating the snapping line
      return;
    }
    const snappingLineFeature = e.features[0] as LineStringFeature;
    setSnappingLine(snappingLineFeature);

    debouncedOnAddRoute(snappingLineFeature);

    if (e.action === 'addFeature') {
      dispatch(stopRouteEditingAction());
    }
  };

  return (
    <DrawControl
      defaultMode="draw_line_string"
      ref={drawRef}
      onCreate={onCreate}
      onUpdate={onUpdate}
    />
  );
};
