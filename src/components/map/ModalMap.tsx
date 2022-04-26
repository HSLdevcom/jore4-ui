import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import {
  useAppDispatch,
  useAppSelector,
  useDeleteRoute,
  useMapUrlQuery,
  useSaveRoute,
} from '../../hooks';
import {
  resetMapEditorStateAction,
  selectIsModalMapOpen,
  selectMapEditor,
  setIsModalMapOpenAction,
  stopDrawRouteAction,
  toggleDrawRouteAction,
  toggleEditRouteAction,
} from '../../redux';
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

  const { editedRouteData, creatingNewRoute } = useAppSelector(selectMapEditor);

  const { id: editingRouteId } = editedRouteData;

  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();

  const {
    saveRoute,
    defaultErrorHandler: defaultSaveErrorHandler,
    conflicts,
    setConflicts,
  } = useSaveRoute();

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
      // Save variable value since saveRoute resets the value in state
      const newRouteCreated = creatingNewRoute;
      await saveRoute();
      showSuccessToast(t('routes.saveSuccess'));

      if (newRouteCreated) {
        mapRef?.current?.onDeleteDrawnRoute();
      }
    } catch (err) {
      defaultSaveErrorHandler(err);
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
