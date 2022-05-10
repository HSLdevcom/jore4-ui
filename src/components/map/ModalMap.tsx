import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { MapFilterContext, setObservationDate } from '../../context/MapFilter';
import { RouteRoute } from '../../generated/graphql';
import {
  useAppDispatch,
  useAppSelector,
  useDeleteRoute,
  useEditRouteGeometry,
  useExtractRouteFromFeature,
  useMapUrlQuery,
} from '../../hooks';
import { useCreateRoute } from '../../hooks/routes/useCreateRoute';
import {
  initializeMapEditorWithRoutesAction,
  resetMapEditorStateAction,
  selectIsModalMapOpen,
  selectMapEditor,
  setIsModalMapOpenAction,
  setSelectedRouteIdAction,
  stopDrawRouteAction,
  toggleDrawRouteAction,
  toggleEditRouteAction,
} from '../../redux';
import { isDateInRange } from '../../time';
import { RequiredKeys } from '../../types';
import { ConfirmationDialog, Modal } from '../../uiComponents';
import { showSuccessToast } from '../../utils';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../routes-and-lines/common/ConflictResolverModal';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { MapHeader } from './MapHeader';

interface Props {
  className?: string;
}

// magic values that can be seen with browsers devtools.
// probably won't work in all corner cases, but e.g. zooming
// broswer in/out doesn't seem to break anything.
const mapHeaderHeight = 64;
const mapFooterHeight = 82;

export const ModalMap: React.FC<Props> = ({ className }) => {
  const mapRef = useRef<ExplicitAny>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isModalMapOpen = useAppSelector(selectIsModalMapOpen);
  const { deleteMapOpenQueryParameter, isMapOpen } = useMapUrlQuery();

  const { editedRouteData, creatingNewRoute, initiallyDisplayedRouteIds } =
    useAppSelector(selectMapEditor);

  const {
    state: { observationDate },
    dispatch: mapFilterDispatch,
  } = useContext(MapFilterContext);

  const {
    id: editedRouteId,
    infraLinks,
    stops: routeStops,
    metaData: routeDetails,
  } = editedRouteData;

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    prepareCreate,
    mapCreateChangesToVariables,
    insertRouteMutation,
    defaultErrorHandler: defaultInsertRouteErrorHandler,
  } = useCreateRoute();
  const {
    mapRouteDetailsToUpdateMutationVariables,
    updateRouteGeometryMutation,
  } = useEditRouteGeometry();
  const [conflicts, setConflicts] = useState<RouteRoute[]>([]);
  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();

  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  const syncIsModalMapStateWithMapOpenQueryParam = () => {
    const mapOpen = isMapOpen();
    dispatch(setIsModalMapOpenAction(mapOpen));
  };

  useEffect(() => {
    // Syncronizes the Redux 'isModalMapOpen' state with the
    // 'mapOpen' query parameter when the page is loaded.
    syncIsModalMapStateWithMapOpenQueryParam();

    // Syncronizes the Redux 'isModalMapOpen' state with the
    // 'mapOpen' query parameter when the url changes.
    // This ensures that the map will be closed if the user
    // clicks the back button and the 'mapOpen' query parameter
    // isn't found from the url.
    return history.listen(() => {
      syncIsModalMapStateWithMapOpenQueryParam();
    });
  });

  const editRoute = async (routeId: UUID) => {
    const stopIdsWithinRoute = mapRouteStopsToStopIds(routeStops);

    // TODO: These will be removed from schema, remove from here as well
    const startingStopId = stopIdsWithinRoute[0];
    const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

    if (!infraLinks || !stopIdsWithinRoute || stopIdsWithinRoute.length < 2) {
      throw new Error(t('routes.tooFewStops'));
    }

    const variables = mapRouteDetailsToUpdateMutationVariables(
      routeId,
      stopIdsWithinRoute,
      infraLinks,
      startingStopId,
      finalStopId,
    );

    await updateRouteGeometryMutation(variables);
  };

  const createRoute = async () => {
    const stopIdsWithinRoute = mapRouteStopsToStopIds(routeStops);

    // TODO: These will be removed from schema, remove from here as well
    const startingStopId = stopIdsWithinRoute[0];
    const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

    if (!infraLinks || !stopIdsWithinRoute || stopIdsWithinRoute.length < 2) {
      throw new Error(t('routes.tooFewStops'));
    }

    const changes = await prepareCreate({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      form: routeDetails!,
      stopIdsWithinRoute,
      infraLinksAlongRoute: infraLinks,
      startingStopId,
      finalStopId,
    });
    if (changes.conflicts?.length) {
      setConflicts(changes.conflicts);
      return undefined;
    }
    const variables = mapCreateChangesToVariables(changes);

    const response = await insertRouteMutation(variables);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return response.data!.insert_route_route_one!;
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
      mapFilterDispatch(setObservationDate(validityStart));
      showSuccessToast(t('filters.observationDateAdjusted'));
    }

    // Reset map editor drap mode and remove draft route
    // as it is now saved

    dispatch(stopDrawRouteAction());

    mapRef?.current?.onDeleteDrawnRoute();
  };

  const onDrawRoute = () => {
    mapRef?.current?.onDeleteDrawnRoute();
    dispatch(toggleDrawRouteAction());
  };
  const onEditRoute = () => {
    if (!creatingNewRoute) {
      mapRef?.current?.onDeleteDrawnRoute();
    }
    dispatch(toggleEditRouteAction());
  };
  const onCancel = () => {
    mapRef?.current?.onDeleteDrawnRoute();

    dispatch(stopDrawRouteAction());
  };
  const onSave = async () => {
    try {
      if (editedRouteId) {
        await editRoute(editedRouteId);
        showSuccessToast(t('routes.saveSuccess'));
      } else {
        const createdRoute = await createRoute();
        showSuccessToast(t('routes.saveSuccess'));

        if (createdRoute) {
          onRouteCreated(createdRoute);
        }
      }
    } catch (err) {
      defaultInsertRouteErrorHandler(err);
    }
  };
  const onDeleteConfirm = async () => {
    try {
      if (!editedRouteId) {
        return;
      }

      // delete the route from the backend
      await deleteRoute(editedRouteId);
      showSuccessToast(t('routes.deleteSuccess'));

      setIsDeleting(false);
      dispatch(setIsModalMapOpenAction(false));
    } catch (err) {
      defaultDeleteErrorHandler(err);
    }
  };

  const onDeleteRoute = async () => {
    if (creatingNewRoute) {
      onCancel();
    } else {
      setIsDeleting(true);
    }
  };

  const onCloseModalMap = () => {
    dispatch(resetMapEditorStateAction());
    dispatch(setIsModalMapOpenAction(false));
    deleteMapOpenQueryParameter();
  };

  return (
    <Modal
      isOpen={isModalMapOpen}
      onClose={onCloseModalMap}
      className={`absolute left-0 top-0 z-10 h-full w-full !bg-background ${
        className || ''
      }`}
    >
      <MapHeader onClose={onCloseModalMap} />
      {/* Setting height of map component dynamically seems to be tricky as
          it doesn't respect e.g. "height: 100%" rule.
          As a workaround we can use css's `calc` function and magically subtract
          height of MapHeader and MapFooterfrom full screen height.
          This is ugly, but seems to work perfectly - at least until someone changes
          height of header/footer...
        */}
      <Map
        height={`calc(100vh - ${mapHeaderHeight + mapFooterHeight}px)`}
        drawable
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={onDrawRoute}
        onEditRoute={onEditRoute}
        onDeleteRoute={onDeleteRoute}
        onCancel={onCancel}
        onSave={onSave}
      />
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
    </Modal>
  );
};
