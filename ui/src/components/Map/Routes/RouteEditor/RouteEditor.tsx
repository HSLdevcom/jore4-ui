import { useApolloClient } from '@apollo/client';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import {
  GetRouteDetailsByIdDocument,
  GetRouteDetailsByIdQuery,
  GetRouteDetailsByIdQueryVariables,
  ReusableComponentsVehicleModeEnum,
} from '../../../../generated/graphql';
import {
  Mode,
  Operation,
  markRouteGeometryDeletedAction,
  resetDraftRouteGeometryAction,
  resetRouteCreatingAction,
  selectDrawingMode,
  selectEditedRouteData,
  selectMapRouteEditor,
  selectSelectedRouteId,
  setDraftRouteJourneyPatternAction,
  setLineInfoAction,
  setRouteMetadataAction,
  setRouteToDrawModeAction,
  setRouteToEditModeAction,
  setSelectedRouteIdAction,
  setSuppressBaseRouteRehydrateAction,
  setTemplateRouteIdAction,
  startExistingRouteRedrawAction,
  startRouteCreatingAction,
  startRouteEditingAction,
  stopRouteEditingAction,
  useAppDispatch,
  useAppSelector,
  useLoader,
} from '../../../../redux';
import {
  showSuccessToast,
  stopInJourneyPatternFieldsToRemove,
} from '../../../../utils';
import { ConfirmationDialog } from '../../../common/Modals';
import {
  StopsNeedingUpdateModal,
  mapRouteToFormState,
  useDeleteRoute,
} from '../../../LinesAndRoutes/Common';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../../../LinesAndRoutes/Common/ConflictResolverModal';
import { useMapUrlStateContext } from '../../Utils/mapUrlState';
import { SNAPPING_LINE_LAYER_ID, removeRoute } from '../Utils';
import { useSaveHelpers } from './Utils';

const RouteEditorComponent: ForwardRefRenderFunction<ExplicitAny> = (
  _,
  externalRef,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { current: map } = useMap();
  const apollo = useApolloClient();

  const { creatingNewRoute, suppressBaseRouteRehydrate } =
    useAppSelector(selectMapRouteEditor);
  const drawingMode = useAppSelector(selectDrawingMode);
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const {
    id: editedRouteId,
    lineInfo,
    journeyPattern,
  } = useAppSelector(selectEditedRouteData);

  const { resetUrlState } = useMapUrlStateContext();

  const [isDeletingRouteGeometry, setIsDeletingRouteGeometry] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    pendingChanges,
    saveBlockers,
    onCancelSave,
    onConfirmSave,
    onDoCreate,
    onDoEdit,
  } = useSaveHelpers();

  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const removeSnappingLineFromMap = () => {
    removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
  };

  const clearDraftGeometryAndSnappingLine = () => {
    dispatch(resetDraftRouteGeometryAction());
    removeSnappingLineFromMap();
  };

  // The "Draw Route" button has been clicked/toggled -> start drawing a new route OR cancel existing drawing
  const onDrawRoute = (vehicleMode: ReusableComponentsVehicleModeEnum) => {
    dispatch(
      drawingMode === Mode.Draw
        ? resetRouteCreatingAction()
        : startRouteCreatingAction(vehicleMode),
    );
  };

  // The "Edit Route" button has been clicked/toggled ->
  // - start editing the selected route OR
  // - start editing the just created route
  const onEditRoute = async () => {
    dispatch(startRouteEditingAction());

    // New routes already have line and metadata in state.
    if (!selectedRouteId) {
      dispatch(setRouteToEditModeAction());
      return;
    }

    // Existing routes need metadata and line info from backend before edit mode.
    const routeDetailsResult = await apollo.query<
      GetRouteDetailsByIdQuery,
      GetRouteDetailsByIdQueryVariables
    >({
      query: GetRouteDetailsByIdDocument,
      variables: { routeId: selectedRouteId },
    });
    const route = routeDetailsResult.data.route_route_by_pk;

    if (!route?.route_line) {
      throw new Error("Can't find route and line details");
    }

    dispatch(setLineInfoAction(route.route_line));
    dispatch(setRouteMetadataAction(mapRouteToFormState(route)));

    // In our data model route has always exactly one journey pattern
    const editedRouteJourneyPattern = route.route_journey_patterns[0];

    const newJourneyPatternStops =
      editedRouteJourneyPattern.ordered_scheduled_stop_point_in_journey_patterns.map(
        (stopInJourneyPattern) => ({
          ...stopInJourneyPattern,
          ...stopInJourneyPatternFieldsToRemove,
        }),
      );

    dispatch(
      setDraftRouteJourneyPatternAction({
        id: editedRouteJourneyPattern.journey_pattern_id,
        stops: newJourneyPatternStops,
      }),
    );
    dispatch(setRouteToEditModeAction());
  };

  const onRedrawRoute = async () => {
    if (creatingNewRoute) {
      dispatch(setRouteToDrawModeAction());
      return;
    }

    if (suppressBaseRouteRehydrate) {
      // Redraw as a new geometry flow while preserving the existing route identity.
      dispatch(startExistingRouteRedrawAction());
      return;
    }

    await onEditRoute();
  };

  const onStopEditRoute = () => {
    dispatch(stopRouteEditingAction());
  };

  const onCancel = () => {
    const isCancelingExistingRouteRedraw =
      suppressBaseRouteRehydrate &&
      creatingNewRoute &&
      drawingMode === Mode.Draw;
    if (isCancelingExistingRouteRedraw) {
      clearDraftGeometryAndSnappingLine();
      dispatch(resetRouteCreatingAction());
      return;
    }

    clearDraftGeometryAndSnappingLine();
    if (!creatingNewRoute && drawingMode === Mode.Edit) {
      dispatch(stopRouteEditingAction());
      return;
    }

    dispatch(resetRouteCreatingAction());
    // TODO: This should be only a temporary solution and the core issue should be fixed which has something to do with the debounced route updates and async calls.
    removeSnappingLineFromMap();
  };

  const onSave = async () => {
    if (saveBlockers) {
      return;
    }

    await (editedRouteId ? onDoEdit : onDoCreate)();
  };

  const onDeleteRouteGeometryConfirm = () => {
    const isExistingRouteEdit = !creatingNewRoute;
    clearDraftGeometryAndSnappingLine();

    // Preserve journey pattern identity so the redrawn route can still be saved.
    if (isExistingRouteEdit && journeyPattern.id) {
      dispatch(
        setDraftRouteJourneyPatternAction({
          id: journeyPattern.id,
          stops: journeyPattern.stops,
        }),
      );
    }

    // Prevent backend data from restoring deleted geometry before redraw.
    if (isExistingRouteEdit) {
      dispatch(setSuppressBaseRouteRehydrateAction(true));
      // Repeated deletes need a new event even when suppression is already enabled.
      dispatch(markRouteGeometryDeletedAction());
    }

    dispatch(setTemplateRouteIdAction(undefined));

    if (creatingNewRoute) {
      dispatch(stopRouteEditingAction());
    }

    setIsDeletingRouteGeometry(false);
  };

  const onDeleteRouteGeometry = () => {
    setIsDeletingRouteGeometry(true);
  };

  const onDeleteConfirm = async () => {
    if (!editedRouteId) {
      setIsDeleting(false);
      return;
    }

    setIsLoading(true);
    try {
      // delete the route from the backend
      await deleteRoute(editedRouteId);
      showSuccessToast(t(($) => $.routes.deleteSuccess));

      // clear the route from the map and reset redux state
      dispatch(stopRouteEditingAction());
      dispatch(setSelectedRouteIdAction(undefined));

      setIsDeleting(false);
      resetUrlState();
    } catch (err) {
      defaultDeleteErrorHandler(err);
    }
    setIsLoading(false);
  };

  const onDeleteRoute = () => {
    setIsDeleting(true);
  };

  useImperativeHandle(externalRef, () => ({
    onDrawRoute,
    onRedrawRoute,
    onEditRoute,
    onStopEditRoute,
    onDeleteRouteGeometry,
    onDeleteRoute,
    onCancel,
    onSave,
  }));

  return (
    <>
      {/* Route geometry deletion dialog */}
      <ConfirmationDialog
        isOpen={isDeletingRouteGeometry}
        onCancel={() => setIsDeletingRouteGeometry(false)}
        onConfirm={onDeleteRouteGeometryConfirm}
        title={t(($) => $.confirmDeleteDrawnRouteDialog.title)}
        description={t(($) => $.confirmDeleteDrawnRouteDialog.description)}
        confirmText={t(($) => $.confirmDeleteDrawnRouteDialog.confirmText)}
        cancelText={t(($) => $.cancel)}
      />

      {/* Route deletion dialog */}
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={onDeleteConfirm}
        title={t(($) => $.confirmDeleteRouteDialog.title)}
        description={t(($) => $.confirmDeleteRouteDialog.description)}
        confirmText={t(($) => $.confirmDeleteRouteDialog.confirmText)}
        cancelText={t(($) => $.cancel)}
      />

      {saveBlockers && (
        <>
          <ConflictResolverModal
            isOpen={saveBlockers.hasConflicts}
            onClose={onCancelSave}
            conflicts={
              pendingChanges?.conflicts.map(mapRouteToCommonConflictItem) ?? []
            }
          />
          <StopsNeedingUpdateModal
            isOpen={saveBlockers.hasStopsNeedingUpdate}
            onCancel={onCancelSave}
            onConfirm={onConfirmSave}
            stops={pendingChanges?.stopsNeedingUpdate ?? []}
            typeOfLine={lineInfo?.type_of_line}
          />
        </>
      )}
    </>
  );
};

export const RouteEditor = forwardRef(RouteEditorComponent);
