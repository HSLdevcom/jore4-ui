import { FC } from 'react';
import {
  MapEntityEditorViewState,
  isModalOpen,
  selectSelectedDepotStopId,
  setSelectedDepotStopIdAction,
  useAppAction,
  useAppSelector,
} from '../../../redux';
import { MapDepotStop } from '../Types';
import { useMapViewState } from '../Utils/useMapViewState';
import { DepotStopModal } from './DepotStop';
import {
  DeleteDepotStopConfirmationDialog,
  useDeleteDepotStopUtils,
} from './DepotStop/DeleteDepotStop';
import { DepotStopPopup } from './ExistingStops/DepotStopPopup';

type EditDepotStopLayerProps = {
  readonly depotStops: ReadonlyArray<MapDepotStop>;
};

export const EditDepotStopLayer: FC<EditDepotStopLayerProps> = ({
  depotStops,
}) => {
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

  const {
    deleteChanges,
    isDeleting,
    onDeleteDepotStop,
    onConfirmDelete,
    onCancelDelete,
  } = useDeleteDepotStopUtils(selectedDepotStop, onPopupClose);

  return (
    <>
      {mapViewState.depotStops === MapEntityEditorViewState.POPUP &&
        selectedDepotStop && (
          <DepotStopPopup
            depotStop={selectedDepotStop}
            onEdit={onEdit}
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

      {isModalOpen(mapViewState.depotStops) && (
        <DepotStopModal editingDepotStop={selectedDepotStop} />
      )}
    </>
  );
};
