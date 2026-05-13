import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
// import { useMap } from 'react-map-gl/maplibre';
import {
  RouteDefaultFieldsFragment,
  RouteRoute,
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
import { RequiredKeys } from '../../../types';
import { Priority } from '../../../types/enums';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  showSuccessToast,
  showWarningToast,
  stopInJourneyPatternFieldsToRemove,
} from '../../../utils';
import { useLoader } from '../../common/hooks/useLoader';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import { useMapUrlStateContext } from '../utils/mapUrlState';
import {
  mapRouteToFormState,
  useCreateRoute,
  useDeleteRoute,
  useEditRouteGeometry,
} from './hooks';

const RouteEditorComponent: ForwardRefRenderFunction<ExplicitAny> = (
  _,
  externalRef,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // const { current: map } = useMap();

  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
  const drawingMode = useAppSelector(selectDrawingMode);
  const selectedRouteId = useAppSelector(selectSelectedRouteId);

  const {
    id: editedRouteId,
    infraLinks,
    stopsEligibleForJourneyPattern,
    includedStopLabels,
    journeyPattern,
    metaData: routeDetails,
  } = useAppSelector(selectEditedRouteData);

  const {
    state: {
      filters: { observationDate },
    },
    setDisplayedRoute,
    setFlatUrlState,
    resetUrlState,
  } = useMapUrlStateContext();

  const [isDeleting, setIsDeleting] = useState(false);
  const [conflicts, setConflicts] = useState<
    ReadonlyArray<RouteDefaultFieldsFragment>
  >([]);

  const [getRouteDetailsById] = useGetRouteDetailsByIdLazyQuery();

  const {
    prepareCreate,
    mapCreateChangesToVariables,
    insertRouteMutation,
    defaultErrorHandler: defaultInsertRouteErrorHandler,
  } = useCreateRoute();

  const {
    prepareEditGeometry,
    mapEditGeometryChangesToVariables,
    editRouteGeometryMutation,
  } = useEditRouteGeometry();

  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();

  const editRoute = async (routeId: UUID) => {
    const changes = await prepareEditGeometry({
      routeId,
      stopsEligibleForJourneyPattern,
      includedStopLabels,
      journeyPatternStops: journeyPattern.stops,
      infraLinksAlongRoute: infraLinks ?? [],
      // journeyPattern id is defined when editing route
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      journeyPatternId: journeyPattern.id!,
    });

    const variables = mapEditGeometryChangesToVariables(changes);

    await editRouteGeometryMutation(variables);
  };

  const { setIsLoading } = useLoader(Operation.SaveRoute);

  const createRoute = async () => {
    const changes = await prepareCreate({
      // At the point of saving a route, the form has been validated
      // and it contains all required values
      form: routeDetails as RouteFormState,
      stopsEligibleForJourneyPattern,
      includedStopLabels,
      journeyPatternStops: journeyPattern.stops,
      infraLinksAlongRoute: infraLinks ?? [],
    });
    if (changes.conflicts?.length) {
      setConflicts(changes.conflicts);
      return undefined;
    }
    const variables = mapCreateChangesToVariables(changes);

    const response = await insertRouteMutation(variables);

    return response.data?.insert_route_route_one;
  };

  const onRouteCreated = (
    newRoute: RequiredKeys<Partial<RouteRoute>, 'route_id'>,
  ) => {
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
  // - start editing the just created route OR
  // - cancel the current edit changes
  const onEditRoute = async () => {
    if (drawingMode === Mode.Edit) {
      // Discard unsaved geometry only when leaving existing-route edit mode.
      if (!creatingNewRoute) {
        dispatch(resetDraftRouteGeometryAction());
      }

      dispatch(stopRouteEditingAction());
    } else {
      // start editing mode
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
    }
  };

  const onCancel = () => {
    dispatch(resetDraftRouteGeometryAction());
    if (!creatingNewRoute && drawingMode === Mode.Edit) {
      dispatch(stopRouteEditingAction());
    } else {
      dispatch(resetRouteCreatingAction());
    }
  };

  const onSave = async () => {
    try {
      setIsLoading(true);

      if (editedRouteId) {
        await editRoute(editedRouteId);
        showSuccessToast(t(($) => $.routes.saveSuccess));
        dispatch(stopRouteEditingAction());
      } else {
        const createdRoute = await createRoute();

        if (createdRoute) {
          showSuccessToast(t(($) => $.routes.saveSuccess));
          onRouteCreated(createdRoute);
        }
      }
    } catch (err) {
      defaultInsertRouteErrorHandler(err);
    }
    setIsLoading(false);
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
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapRouteToCommonConflictItem)}
      />
    </>
  );
};

export const RouteEditor = forwardRef(RouteEditorComponent);
