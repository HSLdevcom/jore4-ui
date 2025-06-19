import React, {
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  RouteDefaultFieldsFragment,
  RouteRoute,
  useGetRouteDetailsByIdLazyQuery,
} from '../../../generated/graphql';
import {
  mapRouteToFormState,
  useAppDispatch,
  useAppSelector,
  useCreateRoute,
  useDeleteRoute,
  useEditRouteGeometry,
  useLoader,
  useMapQueryParams,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  Mode,
  Operation,
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
import { RequiredKeys } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  showSuccessToast,
  stopInJourneyPatternFieldsToRemove,
} from '../../../utils';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';

type RouteEditorProps = {
  onDeleteDrawnRoute: () => void;
};

const RouteEditorComponent: ForwardRefRenderFunction<
  ExplicitAny,
  RouteEditorProps
> = ({ onDeleteDrawnRoute }, externalRef) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

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

  const { updateObservationDateByValidityPeriodIfNeeded } =
    useObservationDateQueryParam();
  const { deleteMapQueryParameters, setRouteId } = useMapQueryParams();

  const [isDeleting, setIsDeleting] = useState(false);
  const [conflicts, setConflicts] = useState<RouteDefaultFieldsFragment[]>([]);

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

    setRouteId(newRoute.route_id);
    // If created route is not valid at the selected observation date,
    // change observation date to created route's validity start date
    // so the user can see the freshly created route

    updateObservationDateByValidityPeriodIfNeeded(newRoute);

    // Reset map editor drap mode and remove draft route
    // as it is now saved

    dispatch(resetRouteCreatingAction());

    onDeleteDrawnRoute();
  };

  // The "Draw Route" button has been clicked/toggled -> start drawing a new route OR cancel existing drawing
  const onDrawRoute = () => {
    onDeleteDrawnRoute();
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
    if (!creatingNewRoute) {
      onDeleteDrawnRoute();
    }

    if (drawingMode === Mode.Edit) {
      dispatch(stopRouteEditingAction());
    } else {
      // start editing mode
      dispatch(startRouteEditingAction());

      // if editing a route that is just being created, we should already have the line info and the route metadata available
      if (!selectedRouteId) {
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
    onDeleteDrawnRoute();

    dispatch(resetRouteCreatingAction());
  };

  const onSave = async () => {
    try {
      setIsLoading(true);

      if (editedRouteId) {
        await editRoute(editedRouteId);
        showSuccessToast(t('routes.saveSuccess'));
      } else {
        const createdRoute = await createRoute();

        if (createdRoute) {
          showSuccessToast(t('routes.saveSuccess'));
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
      showSuccessToast(t('routes.deleteSuccess'));

      setIsDeleting(false);
      deleteMapQueryParameters();
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
        title={t('confirmDeleteRouteDialog.title')}
        description={t('confirmDeleteRouteDialog.description')}
        confirmText={t('confirmDeleteRouteDialog.confirmText')}
        cancelText={t('cancel')}
      />
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapRouteToCommonConflictItem)}
      />
    </>
  );
};

export const RouteEditor = React.forwardRef(RouteEditorComponent);
