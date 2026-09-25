import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle } from 'react';
import {
  MapEntityEditorViewState,
  isModalOpen,
  selectSelectedDepotStopId,
  setSelectedDepotStopIdAction,
  useAppAction,
  useAppSelector,
} from '../../../redux';
import { EditDepotStopLayerRef } from '../refTypes';
import { MapDepotStop } from '../Types';
import { useMapViewState } from '../Utils/useMapViewState';
import { DepotStopModal, EditDepotStopConfirmationDialog } from './DepotStop';
import {
  DeleteDepotStopConfirmationDialog,
  useDeleteDepotStopUtils,
} from './DepotStop/DeleteDepotStop';
import { useMoveDepotStopUtils } from './DepotStop/MoveDepotStop';
import { DepotStopPopup } from './ExistingStops/DepotStopPopup';

type EditDepotStopLayerProps = {
  readonly depotStops: ReadonlyArray<MapDepotStop>;
};

export const EditDepotStopLayer = forwardRef<
  EditDepotStopLayerRef,
  EditDepotStopLayerProps
>(({ depotStops }, ref) => {
  const [mapViewState, setMapViewState] = useMapViewState();
  const selectedDepotStopId = useAppSelector(selectSelectedDepotStopId);
  const setSelectedDepotStopId = useAppAction(setSelectedDepotStopIdAction);

  const selectedDepotStop = depotStops.find(
    (depotStop) => depotStop.id === selectedDepotStopId,
  );

  const onPopupClose = () => {
    setSelectedDepotStopId(undefined);
    setMapViewState({ depotStops: MapEntityEditorViewState.NONE });
  };

  const onEdit = () => {
    setMapViewState({ depotStops: MapEntityEditorViewState.EDIT });
  };

  const onStartMoveDepotStop = () => {
    setMapViewState({ depotStops: MapEntityEditorViewState.MOVE });
  };

  const onMoveFinished = () => {
    setMapViewState({ depotStops: MapEntityEditorViewState.POPUP });
  };

  const {
    deleteChanges,
    isDeleting,
    onDeleteDepotStop,
    onConfirmDelete,
    onCancelDelete,
  } = useDeleteDepotStopUtils(selectedDepotStop, onPopupClose);

  const {
    moveChanges,
    isMoving,
    onMoveDepotStop,
    onConfirmMove,
    onCancelMove,
  } = useMoveDepotStopUtils(selectedDepotStop, onMoveFinished);

  useImperativeHandle(ref, () => ({
    onMoveDepotStop: async (e: MapLayerMouseEvent) => onMoveDepotStop(e),
  }));

  return (
    <>
      {mapViewState.depotStops === MapEntityEditorViewState.POPUP &&
        selectedDepotStop && (
          <DepotStopPopup
            depotStop={selectedDepotStop}
            onEdit={onEdit}
            onMove={onStartMoveDepotStop}
            onDelete={onDeleteDepotStop}
            onClose={onPopupClose}
          />
        )}

      {deleteChanges && (
        <DeleteDepotStopConfirmationDialog
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
          deleteChanges={deleteChanges}
          isConfirming={isDeleting}
        />
      )}

      {moveChanges && (
        <EditDepotStopConfirmationDialog
          onConfirm={onConfirmMove}
          onCancel={onCancelMove}
          editChanges={moveChanges}
          isConfirming={isMoving}
        />
      )}

      {isModalOpen(mapViewState.depotStops) && (
        <DepotStopModal editingDepotStop={selectedDepotStop} />
      )}
    </>
  );
});

EditDepotStopLayer.displayName = 'EditDepotStopLayer';
