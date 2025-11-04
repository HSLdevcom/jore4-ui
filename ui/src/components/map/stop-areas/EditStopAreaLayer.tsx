import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  isModalOpen,
  selectMapStopAreaViewState,
  selectMapStopViewState,
  setEditedStopAreaDataAction,
  setMapStopAreaViewStateAction,
  setMapStopViewStateAction,
  setSelectedMapStopAreaIdAction,
} from '../../../redux';
import { EnrichedStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  getGeometryPoint,
  mapPointToStopRegistryGeoJSON,
  showSuccessToast,
} from '../../../utils';
import { useLoader } from '../../common/hooks';
import { StopAreaFormState, useUpsertStopArea } from '../../forms/stop-area';
import {
  DeleteStopArea,
  useStopAreaDeletion,
} from '../../stop-registry/stop-areas/stop-area-details/hooks/DeleteStopArea';
import { EditStopAreaLayerRef } from '../refTypes';
import { useSetMapObservationDate } from '../utils/useSetObservationDate';
import { EditStopAreaModal } from './EditStopAreaModal';
import { NewStopAreaMarker } from './NewStopAreaMarker';
import { mapStopAreaDataToFormState } from './StopAreaForm';
import { StopAreaPopup } from './StopAreaPopup';

type EditStopAreaLayerProps = {
  readonly editedArea: EnrichedStopPlace;
  readonly onPopupClose: () => void;
};

export const EditStopAreaLayer = forwardRef<
  EditStopAreaLayerRef,
  EditStopAreaLayerProps
>(({ editedArea, onPopupClose }, ref) => {
  const { t } = useTranslation();

  const map = useMap();

  const mapStopViewState = useAppSelector(selectMapStopViewState);
  const setMapStopViewState = useAppAction(setMapStopViewStateAction);

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);
  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const setSelectedMapStopAreaId = useAppAction(setSelectedMapStopAreaIdAction);
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);

  const [isConfirmMoveDialogOpen, setIsConfirmMoveDialogOpen] = useState(false);
  const [isConfirmEditDialogOpen, setIsConfirmEditDialogOpen] = useState(false);
  const [newStopAreaLocation, setNewStopAreaLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [stopAreaEditChanges, setStopAreaEditChanges] =
    useState<StopAreaFormState | null>(null);

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();

  const { setIsLoading } = useLoader(Operation.ModifyStopArea);

  const { isConfirmDeleteDialogOpen, openDeleteDialog, closeDeleteDialog } =
    useStopAreaDeletion();

  const setMapObservationDate = useSetMapObservationDate();

  const onStartEditStopArea = () => {
    const point = getGeometryPoint(editedArea.geometry);
    if (point) {
      map.current?.easeTo({
        center: {
          lon: point.longitude,
          lat: point.latitude,
        },
      });
    }

    setMapStopAreaViewState(MapEntityEditorViewState.EDIT);
  };

  const onStartMoveStopArea = () => {
    setMapStopAreaViewState(MapEntityEditorViewState.MOVE);
  };

  const onAddStop = () => {
    setMapStopViewState(MapEntityEditorViewState.PLACE);
  };

  const onCloseEditors = () => {
    setEditedStopAreaData(undefined);
    setMapStopAreaViewState(MapEntityEditorViewState.NONE);
    onPopupClose();
  };

  const onMoveStopArea = (e: MapLayerMouseEvent) => {
    const [longitude, latitude] = e.lngLat.toArray();
    setNewStopAreaLocation({ longitude, latitude });
    setIsConfirmMoveDialogOpen(true);
  };
  const onCancelMoveStopArea = () => {
    setIsConfirmMoveDialogOpen(false);
    setMapStopAreaViewState(MapEntityEditorViewState.POPUP);
  };

  const doUpsertStopArea = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      const updatedStopArea = await upsertStopArea({ stop: editedArea, state });
      setEditedStopAreaData(updatedStopArea);
      setSelectedMapStopAreaId(updatedStopArea?.id ?? undefined);
      setMapStopAreaViewState(MapEntityEditorViewState.POPUP);

      if (editedArea.id) {
        showSuccessToast(t('stopArea.editSuccess'));
      } else {
        showSuccessToast(t('stopArea.saveSuccess'));
      }

      setMapObservationDate(updatedStopArea);
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const onEditStopArea = async (state: StopAreaFormState) => {
    // Confirm if editing an existing area, but submit new area creation without confirmation.
    if (editedArea.id) {
      setStopAreaEditChanges(state);
      setIsConfirmEditDialogOpen(true);
    } else {
      await doUpsertStopArea(state);
    }
  };

  const onCancelEditStopArea = () => {
    setIsConfirmEditDialogOpen(false);
  };

  const onConfirmEditStopArea = async () => {
    if (!stopAreaEditChanges) {
      return;
    }

    await doUpsertStopArea(stopAreaEditChanges);
    setIsConfirmEditDialogOpen(false);
    setStopAreaEditChanges(null);
  };

  const onConfirmMoveStopArea = async () => {
    if (!newStopAreaLocation) {
      return;
    }

    const { longitude, latitude } = newStopAreaLocation;
    const geometry = mapPointToStopRegistryGeoJSON({
      longitude,
      latitude,
    });

    const stopAreaFormState = mapStopAreaDataToFormState({
      ...editedArea,
      geometry,
    });
    // An existing stop area, so all required properties have already been persisted -> safe to cast.
    await doUpsertStopArea(stopAreaFormState as Required<StopAreaFormState>);
    setIsConfirmMoveDialogOpen(false);
    setNewStopAreaLocation(null);
  };

  const onDeleteSuccess = () => {
    setMapStopAreaViewState(MapEntityEditorViewState.NONE);
    setEditedStopAreaData(undefined);
    setSelectedMapStopAreaId(undefined);
    showSuccessToast(t('stopArea.deleteSuccess'));
  };

  const onCloseModal = () => {
    if (editedArea.id) {
      setMapStopAreaViewState(MapEntityEditorViewState.POPUP);
    } else {
      onCloseEditors();
    }
  };

  useImperativeHandle(ref, () => ({
    onMoveStopArea: async (e: MapLayerMouseEvent) => onMoveStopArea(e),
  }));

  return (
    <>
      {mapStopAreaViewState === MapEntityEditorViewState.POPUP &&
        mapStopViewState === MapEntityEditorViewState.NONE && (
          <StopAreaPopup
            area={editedArea}
            onAddStop={onAddStop}
            onDelete={openDeleteDialog}
            onEdit={onStartEditStopArea}
            onMove={onStartMoveStopArea}
            onClose={onCloseEditors}
          />
        )}
      {isModalOpen(mapStopAreaViewState) && (
        <EditStopAreaModal
          editedArea={editedArea}
          onCancel={onCloseModal}
          onClose={onCloseModal}
          onSubmit={onEditStopArea}
        />
      )}

      <NewStopAreaMarker editedArea={editedArea} />

      <DeleteStopArea
        stopArea={editedArea}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDeleteSuccess={onDeleteSuccess}
        defaultErrorHandler={defaultErrorHandler}
      />
      <ConfirmationDialog
        isOpen={isConfirmMoveDialogOpen}
        onCancel={onCancelMoveStopArea}
        onConfirm={onConfirmMoveStopArea}
        title={t('confirmEditStopAreaDialog.title')}
        description={t('confirmEditStopAreaDialog.description', {
          stopAreaLabel: editedArea.privateCode?.value ?? '',
        })}
        confirmText={t('confirmEditStopAreaDialog.confirmText')}
        cancelText={t('cancel')}
        widthClassName="w-235"
      />
      <ConfirmationDialog
        isOpen={isConfirmEditDialogOpen}
        onCancel={onCancelEditStopArea}
        onConfirm={onConfirmEditStopArea}
        title={t('confirmEditStopAreaDialog.title')}
        description={t('confirmEditStopAreaDialog.description', {
          stopAreaLabel: editedArea.privateCode?.value ?? '',
        })}
        confirmText={t('confirmEditStopAreaDialog.confirmText')}
        cancelText={t('cancel')}
        widthClassName="w-235"
      />
    </>
  );
});

EditStopAreaLayer.displayName = 'EditStopAreaLayer';
