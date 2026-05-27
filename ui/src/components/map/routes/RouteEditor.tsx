import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import {
  RouteDefaultFieldsFragment,
  useGetRouteDetailsByIdLazyQuery,
} from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
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
} from '../../../redux';
import { isDateInRange } from '../../../time';
import { Priority } from '../../../types/enums';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  showDangerToastWithError,
  showSuccessToast,
  showWarningToast,
  stopInJourneyPatternFieldsToRemove,
} from '../../../utils';
import { removeRoute } from '../../../utils/map';
import { useLoader } from '../../common/hooks/useLoader';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import {
  SaveBlockers,
  getBlockers,
  hasBlockers,
} from '../../routes-and-lines/common/SaveBlockers';
import { StopsNeedingUpdateModal } from '../../routes-and-lines/common/StopsNeedingUpdateModal';
import { StopMetaTypeUpdateInfo } from '../../routes-and-lines/common/useUpdateStopRegistryStopMetatype';
import { useMapUrlStateContext } from '../utils/mapUrlState';
import {
  CreateChanges,
  EditChanges,
  mapRouteToFormState,
  useCreateRoute,
  useDeleteRoute,
  useEditRouteGeometry,
} from './hooks';
import { SNAPPING_LINE_LAYER_ID } from './utils';

// default handler that can be used to show error messages as toast
// in case an exception is thrown
function useDefaultErrorHandler() {
  const { t } = useTranslation();

  return (err: unknown) =>
    showDangerToastWithError(
      t(($) => $.errors.saveFailed),
      err,
    );
}

function useCreateRouteHelper() {
  const { t } = useTranslation();
  const defaultErrorHandler = useDefaultErrorHandler();

  const {
    state: {
      filters: { observationDate },
    },
    setDisplayedRoute,
    setFlatUrlState,
  } = useMapUrlStateContext();

  const dispatch = useAppDispatch();

  const {
    editedRouteData: { lineInfo },
  } = useAppSelector(selectMapRouteEditor);

  const {
    infraLinks,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPattern,
    metaData: routeDetails,
  } = useAppSelector(selectEditedRouteData);

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const [pendingChanges, setPendingChanges] = useState<CreateChanges | null>(
    null,
  );

  const { prepareCreate, insertRouteMutation } = useCreateRoute();

  const onCommitCreateChanges = async (changes: CreateChanges) => {
    const result = await insertRouteMutation(changes);
    const newRoute = result.data?.insert_route_route_one;

    // Should never happen as insertRouteMutation itself will throw if the mutation failed.
    // But typings are not good.
    if (!newRoute) {
      throw new Error('Failed to insert route!');
    }

    showSuccessToast(t(($) => $.routes.saveSuccess));

    // Select created route
    dispatch(setSelectedRouteIdAction(newRoute.route_id));

    setDisplayedRoute(() => ({
      routeId: newRoute.route_id,
      lineLabel: null,
      routeLabels: [],
      routePriorities: [Priority.Standard, Priority.Temporary, Priority.Draft],
      showSelectedDaySituation: false,
    }));

    // // If created route is not valid at the selected observation date,
    // // change observation date to created route's validity start date
    // // so the user can see the freshly created route
    if (
      !isDateInRange(
        observationDate,
        newRoute.validity_start,
        newRoute.validity_end,
      )
    ) {
      setFlatUrlState((p) => ({
        ...p,
        observationDate:
          newRoute.validity_start ?? newRoute.validity_end ?? observationDate,
      }));
      showWarningToast(t(($) => $.filters.observationDateAdjusted));
    }

    // Reset map editor state and clear draft route visuals.
    dispatch(resetDraftRouteGeometryAction());
    dispatch(resetRouteCreatingAction());
  };

  const onDoCreate = async () => {
    try {
      setIsLoading(true);
      const changes = await prepareCreate({
        // At the point of saving a route, the form has been validated
        // and it contains all required values
        form: routeDetails as RouteFormState,
        stopsEligibleForJourneyPattern,
        includedStopLabels,
        journeyPatternStops: journeyPattern.stops,
        infraLinksAlongRoute: infraLinks ?? [],
        lineType: lineInfo?.type_of_line ?? null,
      });

      if (hasBlockers(changes)) {
        setPendingChanges(changes);
      } else {
        await onCommitCreateChanges(changes);
      }
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingCreateChanges: pendingChanges,
    onCancelCreate: () => setPendingChanges(null),
    onConfirmCreate: pendingChanges
      ? () => {
          setIsLoading(true);
          setPendingChanges(null);

          return onCommitCreateChanges(pendingChanges).finally(() =>
            setIsLoading(false),
          );
        }
      : null,
    onDoCreate,
  };
}

function useEditRouteHelper() {
  const { t } = useTranslation();
  const defaultErrorHandler = useDefaultErrorHandler();
  const dispatch = useAppDispatch();

  const {
    id,
    infraLinks,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPattern,
    metaData: routeDetails,
    lineInfo,
  } = useAppSelector(selectEditedRouteData);

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const [pendingChanges, setPendingChanges] = useState<EditChanges | null>(
    null,
  );

  const { prepareEditGeometry, editRouteGeometryMutation } =
    useEditRouteGeometry();

  const onCommitEditChanges = async (changes: EditChanges) => {
    await editRouteGeometryMutation(changes);

    showSuccessToast(t(($) => $.routes.saveSuccess));
    dispatch(stopRouteEditingAction());
  };

  const onDoEdit = async () => {
    if (!infraLinks || !journeyPattern.id || !routeDetails || !lineInfo) {
      const fields = JSON.stringify(
        {
          infraLinks,
          'journeyPattern.id': journeyPattern.id,
          routeDetails,
          lineInfo,
        },
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        (v) => (v === undefined ? '!!undefined¡¡' : v),
        0,
      );
      throw new Error(
        `Illegal state! Expected all fields (${fields}) to be valid!`,
      );
    }

    try {
      const changes = await prepareEditGeometry({
        routeId: id ?? '',
        stopsEligibleForJourneyPattern,
        includedStopLabels,
        journeyPatternStops: journeyPattern.stops,
        infraLinksAlongRoute: infraLinks,
        journeyPatternId: journeyPattern.id,
        routePriority: routeDetails.priority,
        lineType: lineInfo.type_of_line,
      });

      if (hasBlockers(changes)) {
        setPendingChanges(changes);
      } else {
        await onCommitEditChanges(changes);
      }
    } catch (e) {
      defaultErrorHandler(e);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pendingEditChanges: pendingChanges,
    onCancelEdit: () => setPendingChanges(null),
    onConfirmEdit: pendingChanges
      ? () => {
          setIsLoading(true);
          setPendingChanges(null);

          return onCommitEditChanges(pendingChanges).finally(() =>
            setIsLoading(false),
          );
        }
      : null,
    onDoEdit,
  };
}

type PendingChanges = {
  readonly conflicts: ReadonlyArray<RouteDefaultFieldsFragment>;
  readonly stopsNeedingUpdate: ReadonlyArray<StopMetaTypeUpdateInfo>;
};

type SaveHelpersConfirm = {
  readonly pendingChanges: PendingChanges;
  readonly saveBlockers: SaveBlockers;
  readonly onCancelSave: () => void;
  readonly onConfirmSave: () => Promise<unknown>;
  readonly onDoCreate?: never;
  readonly onDoEdit?: never;
};

type SaveHelpersDo = {
  readonly pendingChanges: null;
  readonly saveBlockers: null;
  readonly onCancelSave?: never;
  readonly onConfirmSave?: never;
  readonly onDoCreate: () => Promise<unknown>;
  readonly onDoEdit: () => Promise<unknown>;
};

function useSaveHelpers(): SaveHelpersConfirm | SaveHelpersDo {
  const { pendingCreateChanges, onCancelCreate, onConfirmCreate, onDoCreate } =
    useCreateRouteHelper();
  const { pendingEditChanges, onCancelEdit, onConfirmEdit, onDoEdit } =
    useEditRouteHelper();

  if (pendingCreateChanges && onConfirmCreate) {
    return {
      pendingChanges: pendingCreateChanges,
      saveBlockers: getBlockers(pendingCreateChanges),
      onCancelSave: onCancelCreate,
      onConfirmSave: onConfirmCreate,
    };
  }

  if (pendingEditChanges && onConfirmEdit) {
    return {
      pendingChanges: pendingEditChanges,
      saveBlockers: getBlockers(pendingEditChanges),
      onCancelSave: onCancelEdit,
      onConfirmSave: onConfirmEdit,
    };
  }

  return { pendingChanges: null, saveBlockers: null, onDoCreate, onDoEdit };
}

const RouteEditorComponent: ForwardRefRenderFunction<ExplicitAny> = (
  _,
  externalRef,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { current: map } = useMap();

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

  const [getRouteDetailsById] = useGetRouteDetailsByIdLazyQuery();

  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  // The "Draw Route" button has been clicked/toggled -> start drawing a new route OR cancel existing drawing
  const onDrawRoute = () => {
    if (drawingMode === Mode.Draw) {
      dispatch(resetRouteCreatingAction());
    } else {
      dispatch(startRouteCreatingAction());
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
    const routeDetailsResult = await getRouteDetailsById({
      variables: {
        routeId: selectedRouteId,
      },
    });
    if (!routeDetailsResult.data?.route_route_by_pk?.route_line) {
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
