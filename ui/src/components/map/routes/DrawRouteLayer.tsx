import { Feature } from '@nebula.gl/edit-modes';
import composeRefs from '@seznam/compose-react-refs';
import debounce from 'lodash/debounce';
import isNil from 'lodash/isNil';
import remove from 'lodash/remove';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DrawLineStringMode,
  EditingMode,
  Editor,
  SelectAction,
} from 'react-map-gl-draw';
import { useGetRouteDetailsByIdQuery } from '../../../generated/graphql';
import { mapRouteToInfraLinksAlongRoute } from '../../../graphql';
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
} from '../../../hooks';
import {
  Mode,
  Operation,
  resetDraftRouteGeometryAction,
  selectEditedRouteData,
  selectHasDraftRouteGeometry,
  selectMapRouteEditor,
  setDraftRouteGeometryAction,
  stopRouteEditingAction,
} from '../../../redux';
import { parseDate } from '../../../time';
import {
  MapMatchingNoSegmentError,
  log,
  showDangerToast,
  showToast,
} from '../../../utils';
import { featureStyle, handleStyle } from './editorStyles';

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
  const editorRef = useRef<ExplicitAny>(null);

  const dispatch = useAppDispatch();
  const { creatingNewRoute, isRouteMetadataFormOpen } =
    useAppSelector(selectMapRouteEditor);
  const hasDraftRouteGeometry = useAppSelector(selectHasDraftRouteGeometry);
  const editedRouteData = useAppSelector(selectEditedRouteData);

  const { templateRouteId } = editedRouteData;

  // the geojson for the grey line that is used for snapping the draft route to the infra network
  const [snappingLine, setSnappingLine] = useState<LineStringFeature>();

  const [selectedSnapPoints, setSelectedSnapPoints] = useState<number[]>([]);

  const { getInfraLinksWithStopsForGeometry, getRemovedStopLabels } =
    useExtractRouteFromFeature();

  const { setIsLoading } = useLoader(Operation.MatchRoute);

  const { t } = useTranslation();

  useImperativeHandle(externalRef, () => ({
    onDeleteRoute: () => {
      setSnappingLine(undefined);
      dispatch(resetDraftRouteGeometryAction());
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
  const baseRouteResult = useGetRouteDetailsByIdQuery({
    skip: !baseRouteId,
    // If baseRouteId is undefined, this query is skipped
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { routeId: baseRouteId! },
  });
  const baseRoute = baseRouteResult.data?.route_route_by_pk || undefined;

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
          setIsLoading(false);
          throw err;
        }
      }

      if (!infraLinksWithStops) {
        setIsLoading(false);
        return;
      }

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
      setIsLoading(false);
    },
    [
      baseRoute,
      creatingNewRoute,
      dispatch,
      editedRouteData.includedStopLabels,
      editedRouteData.infraLinks,
      editedRouteData.metaData,
      getInfraLinksWithStopsForGeometry,
      getRemovedStopLabels,
      setIsLoading,
      t,
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
      const infraLinks = mapRouteToInfraLinksAlongRoute(baseRoute);
      const infraSnappingLine = mapInfraLinksToFeature(infraLinks);

      setSnappingLine(infraSnappingLine);
      onUpdateRouteGeometry(infraSnappingLine);
    } else {
      // If not drawing or editing, clear snapping line
      setSnappingLine(undefined);
    }
  }, [
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
      clickRadius={20}
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