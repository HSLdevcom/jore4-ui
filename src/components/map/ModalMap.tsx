import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { MapEditorContext, Mode } from '../../context/MapEditor';
import { MapFilterContext, setObservationDate } from '../../context/MapFilter';
import {
  useAppDispatch,
  useAppSelector,
  useDeleteRoute,
  useEditRouteGeometry,
  useExtractRouteFromFeature,
  useMapUrlQuery,
} from '../../hooks';
import { selectIsModalMapOpen, setIsModalMapOpenAction } from '../../redux';
import { isDateInRange } from '../../time';
import { ConfirmationDialog, Modal } from '../../uiComponents';
import { showSuccessToast, showToast } from '../../utils';
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
  const { state: mapEditorState, dispatch: mapEditorDispatch } =
    useContext(MapEditorContext);
  const {
    state: { observationDate },
    dispatch: mapFilterDispatch,
  } = useContext(MapFilterContext);

  const {
    id: editingRouteId,
    infraLinks,
    stops: routeStops,
    metaData: routeDetails,
  } = mapEditorState.editedRouteData;

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    mapRouteDetailsToInsertMutationVariables,
    mapRouteDetailsToUpdateMutationVariables,
    insertRouteMutation,
    updateRouteGeometryMutation,
  } = useEditRouteGeometry();
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

  const { drawingMode } = mapEditorState;

  const onDrawRoute = () => {
    mapRef?.current?.onDeleteDrawnRoute();
    mapEditorDispatch({
      type: drawingMode === Mode.Draw ? 'stopDrawRoute' : 'startDrawRoute',
    });
  };
  const onEditRoute = () => {
    if (!mapEditorState.creatingNewRoute) {
      mapRef?.current?.onDeleteDrawnRoute();
    }
    mapEditorDispatch({
      type: drawingMode === Mode.Edit ? 'stopEditRoute' : 'startEditRoute',
    });
  };
  const onCancel = () => {
    mapRef?.current?.onDeleteDrawnRoute();

    mapEditorDispatch({ type: 'stopDrawRoute' });
  };
  const onSave = async () => {
    const stopIdsWithinRoute = mapRouteStopsToStopIds(routeStops);

    if (infraLinks && stopIdsWithinRoute && stopIdsWithinRoute.length >= 2) {
      const startingStopId = stopIdsWithinRoute[0];
      const finalStopId = stopIdsWithinRoute[stopIdsWithinRoute.length - 1];

      if (editingRouteId) {
        const variables = mapRouteDetailsToUpdateMutationVariables(
          editingRouteId,
          stopIdsWithinRoute,
          infraLinks,
          startingStopId,
          finalStopId,
        );

        try {
          await updateRouteGeometryMutation(variables);
          showToast({ type: 'success', message: t('routes.saveSuccess') });
        } catch (err) {
          showToast({
            type: 'danger',
            message: `${t('errors.saveFailed')}, ${err}`,
          });
        }
      } else {
        if (!routeDetails) {
          return;
        }

        const variables = mapRouteDetailsToInsertMutationVariables(
          routeDetails,
          stopIdsWithinRoute,
          infraLinks,
          startingStopId,
          finalStopId,
        );

        try {
          const response = await insertRouteMutation(variables);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newRoute = response.data!.insert_route_route_one!;

          mapEditorDispatch({
            type: 'setState',
            payload: {
              initiallyDisplayedRouteIds: [newRoute.route_id],
            },
          });

          showSuccessToast(t('routes.saveSuccess'));

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const validityStart = newRoute.validity_start!;

          if (
            !isDateInRange(
              observationDate,
              validityStart,
              newRoute?.validity_end,
            )
          ) {
            mapFilterDispatch(setObservationDate(validityStart));
            showSuccessToast(t('filters.observationDateAdjusted'));
          }

          mapEditorDispatch({ type: 'stopDrawRoute' });
          mapRef?.current?.onDeleteDrawnRoute();
        } catch (err) {
          showToast({
            type: 'danger',
            message: `${t('errors.saveFailed')}, ${err}`,
          });
        }
      }
    } else {
      showToast({ type: 'danger', message: t('errors.saveFailed') });
    }
  };
  const onDeleteConfirm = async () => {
    try {
      if (!editingRouteId) {
        return;
      }

      // delete the route from the backend
      await deleteRoute(editingRouteId);
      showSuccessToast(t('routes.deleteSuccess'));

      setIsDeleting(false);
      dispatch(setIsModalMapOpenAction(false));
    } catch (err) {
      defaultDeleteErrorHandler(err);
    }
  };

  const onDeleteRoute = async () => {
    if (mapEditorState.creatingNewRoute) {
      onCancel();
    } else {
      setIsDeleting(true);
    }
  };

  const onCloseModalMap = () => {
    mapEditorDispatch({ type: 'reset' });
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
    </Modal>
  );
};
