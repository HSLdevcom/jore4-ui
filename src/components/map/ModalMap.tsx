import React, { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEditorContext, Mode } from '../../context/MapEditorContext';
import { ModalMapContext } from '../../context/ModalMapContext';
import { useEditRouteGeometry } from '../../hooks/useEditRouteGeometry';
import { ConfirmationDialog, Modal } from '../../uiComponents';
import { showToast } from '../../utils';
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
  const { state: mapEditorState, dispatch: mapEditorDispatch } =
    useContext(MapEditorContext);
  const { state: modalMapState, dispatch: modalMapDispatch } =
    useContext(ModalMapContext);

  const {
    id: editingRouteId,
    infraLinks,
    stopIds: stopIdsWithinRoute,
    metaData: routeDetails,
  } = mapEditorState.editedRouteData;

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    mapRouteDetailsToInsertMutationVariables,
    mapRouteDetailsToUpdateMutationVariables,
    insertRouteMutation,
    updateRouteGeometryMutation,
    deleteRoute,
  } = useEditRouteGeometry();

  const { drawingMode } = mapEditorState;

  const onAddStop = () => mapEditorDispatch({ type: 'toggleAddStop' });
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
    const { busRoute } = mapEditorState;

    if (
      busRoute &&
      infraLinks &&
      stopIdsWithinRoute &&
      stopIdsWithinRoute.length >= 2
    ) {
      // TODO: user should be able to select starting stop and final stop from some kind of UI.
      // TODO: for now, just use the first and last stops found.
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
          const newRouteId = response.data?.insert_route_route_one?.route_id;

          mapEditorDispatch({
            type: 'setState',
            payload: {
              displayedRouteIds: [
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                newRouteId!,
              ],
            },
          });

          showToast({ type: 'success', message: t('routes.saveSuccess') });
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

      showToast({ type: 'success', message: t('routes.deleteSuccess') });

      setIsDeleting(false);
      modalMapDispatch({ type: 'close' });
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
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
    modalMapDispatch({ type: 'close' });
  };

  const { canAddStops } = mapEditorState;

  return (
    <Modal
      isOpen={modalMapState.isOpen}
      onClose={onCloseModalMap}
      className={className}
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
        canAddStops={canAddStops}
        drawable
        ref={mapRef}
      />
      <MapFooter
        onDrawRoute={onDrawRoute}
        onEditRoute={onEditRoute}
        onDeleteRoute={onDeleteRoute}
        onCancel={onCancel}
        onSave={onSave}
        canAddStops={canAddStops}
        onAddStop={onAddStop}
      />
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={onDeleteConfirm}
        title={t('confirmDeleteRouteDialog.title')}
        description={t('confirmDeleteRouteDialog.description')}
        confirmText={t('confirmDeleteRouteDialog.confirmText')}
        cancelText={t('confirmDeleteRouteDialog.cancelText')}
      />
    </Modal>
  );
};
