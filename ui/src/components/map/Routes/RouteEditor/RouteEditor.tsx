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
  resetDraftRouteGeometryAction,
  resetRouteCreatingAction,
  selectDrawingMode,
  selectEditedRouteData,
  selectMapRouteEditor,
  selectSelectedRouteId,
  setDraftRouteJourneyPatternAction,
  setLineInfoAction,
  setRouteMetadataAction,
  setRouteToEditModeAction,
  setSelectedRouteIdAction,
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

  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
  const drawingMode = useAppSelector(selectDrawingMode);
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const { id: editedRouteId, lineInfo } = useAppSelector(selectEditedRouteData);

  const { resetUrlState } = useMapUrlStateContext();

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

  // The "Draw Route" button has been clicked/toggled -> start drawing a new route OR cancel existing drawing
  const onDrawRoute = (vehicleMode: ReusableComponentsVehicleModeEnum) => {
    if (drawingMode === Mode.Draw) {
      dispatch(resetRouteCreatingAction());
    } else {
      dispatch(startRouteCreatingAction(vehicleMode));
    }
  };

  // The "Edit Route" button has been clicked/toggled ->
  // - start editing the selected route OR
  // - start editing the just created route
  const onEditRoute = async () => {
    dispatch(startRouteEditingAction());

    // if editing a route that is just being created, we should already have the line info and the route metadata available
    if (!selectedRouteId) {
      dispatch(setRouteToEditModeAction());
      return;
    }

    // if editing an existing route, find the route's metadata and line information, store it in editedRouteData
    const routeDetailsResult = await apollo.query<
      GetRouteDetailsByIdQuery,
      GetRouteDetailsByIdQueryVariables
    >({
      query: GetRouteDetailsByIdDocument,
      variables: { routeId: selectedRouteId },
    });

    if (!routeDetailsResult.data.route_route_by_pk?.route_line) {
      throw new Error("Can't find route and line details");
    }

    dispatch(
      setLineInfoAction(routeDetailsResult.data.route_route_by_pk.route_line),
    );
    dispatch(
      setRouteMetadataAction(
        mapRouteToFormState(routeDetailsResult.data.route_route_by_pk),
      ),
    );

    // In our data model route has always exactly one journey pattern
    const editedRouteJourneyPattern =
      routeDetailsResult.data.route_route_by_pk.route_journey_patterns[0];

    // Preserve journey pattern stop metadata (e.g. via info)

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

  const onStopEditRoute = () => {
    dispatch(stopRouteEditingAction());
  };

  const onCancel = () => {
    dispatch(resetDraftRouteGeometryAction());
    if (!creatingNewRoute && drawingMode === Mode.Edit) {
      dispatch(stopRouteEditingAction());
    } else {
      dispatch(resetRouteCreatingAction());
      dispatch(resetDraftRouteGeometryAction());
      // TODO: This should be only a temporary solution and the core issue should be fixed which has something to do with the debounced route updates and async calls.
      // Fallback to removing snapping line if it wasn't removed when canceling drawing.
      removeRoute(map?.getMap(), SNAPPING_LINE_LAYER_ID);
    }
  };

  const onSave = async () => {
    if (!saveBlockers) {
      if (editedRouteId) {
        await onDoEdit();
      } else {
        await onDoCreate();
      }
    }
  };

  const onDeleteConfirm = async () => {
    if (!editedRouteId) {
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

  const onDeleteRoute = async () => {
    if (creatingNewRoute) {
      onCancel();
    } else {
      setIsDeleting(true);
    }
  };

  useImperativeHandle(externalRef, () => ({
    onDrawRoute,
    onEditRoute,
    onStopEditRoute,
    onDeleteRoute,
    onCancel,
    onSave,
  }));

  return (
    <>
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
