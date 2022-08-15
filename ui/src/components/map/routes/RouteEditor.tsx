import React, { Ref, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RouteRoute,
  useGetRouteDetailsByIdAsyncQuery,
} from '../../../generated/graphql';
import {
  mapRouteToFormState,
  useAppDispatch,
  useAppSelector,
  useCreateRoute,
  useDeleteRoute,
  useEditRouteGeometry,
  useMapQueryParams,
} from '../../../hooks';
import {
  initializeMapEditorWithRoutesAction,
  Mode,
  resetRouteCreatingAction,
  selectDrawingMode,
  selectMapEditor,
  selectMapObservationDate,
  selectSelectedRouteId,
  setLineInfoAction,
  setMapEditorLoadingAction,
  setMapObservationDateAction,
  setRouteMetadataAction,
  setSelectedRouteIdAction,
  startRouteCreatingAction,
  startRouteEditingAction,
  stopRouteEditingAction,
} from '../../../redux';
import { isDateInRange } from '../../../time';
import { RequiredKeys } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { showSuccessToast } from '../../../utils';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';

interface Props {
  onDeleteDrawnRoute: () => void;
}

const RouteEditorComponent = (
  { onDeleteDrawnRoute }: Props,
  externalRef: Ref<ExplicitAny>,
) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { editedRouteData, creatingNewRoute, initiallyDisplayedRouteIds } =
    useAppSelector(selectMapEditor);
  const observationDate = useAppSelector(selectMapObservationDate);
  const drawingMode = useAppSelector(selectDrawingMode);
  const selectedRouteId = useAppSelector(selectSelectedRouteId);
  const { deleteMapQueryParameters } = useMapQueryParams();

  const {
    id: editedRouteId,
    infraLinks,
    stops: routeStops,
    metaData: routeDetails,
  } = editedRouteData;

  const [isDeleting, setIsDeleting] = useState(false);
  const [conflicts, setConflicts] = useState<RouteRoute[]>([]);

  const [getRouteDetailsById] = useGetRouteDetailsByIdAsyncQuery();

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
      newGeometry: {
        routeStops,
        infraLinksAlongRoute: infraLinks || [],
      },
    });

    const variables = mapEditGeometryChangesToVariables(changes);

    await editRouteGeometryMutation(variables);
  };

  const setIsLoading = (loading: boolean) =>
    dispatch(setMapEditorLoadingAction(loading));

  const createRoute = async () => {
    const changes = await prepareCreate({
      // At the point of saving a route, the form has been validated
      // and it contains all required values
      form: routeDetails as RouteFormState,
      routeGeometry: {
        routeStops,
        infraLinksAlongRoute: infraLinks || [],
      },
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
    // Add created route to displayed routes
    dispatch(
      initializeMapEditorWithRoutesAction([
        ...(initiallyDisplayedRouteIds || []),
        newRoute.route_id,
      ]),
    );

    // Select created route
    dispatch(setSelectedRouteIdAction(newRoute.route_id));

    // If created route is not valid at the selected observation date,
    // change observation date to created route's validity start date
    // so the user can see the freshly created route

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validityStart = newRoute.validity_start!;

    if (
      !isDateInRange(observationDate, validityStart, newRoute?.validity_end)
    ) {
      dispatch(setMapObservationDateAction(validityStart));
      showSuccessToast(t('filters.observationDateAdjusted'));
    }

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
        routeId: selectedRouteId,
      });
      if (!routeDetailsResult.data?.route_route_by_pk?.route_line)
        throw new Error("Can't find route and line details");

      dispatch(
        setLineInfoAction(routeDetailsResult.data.route_route_by_pk.route_line),
      );
      dispatch(
        setRouteMetadataAction(
          mapRouteToFormState(routeDetailsResult.data.route_route_by_pk),
        ),
      );
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
