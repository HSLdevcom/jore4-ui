import { MapLayerMouseEvent } from 'maplibre-gl';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  DeleteStopArea,
  useStopAreaDeletion,
} from '../../../hooks/stop-registry/stop-areas/DeleteStopArea';
import {
  MapEntityEditorViewState,
  Operation,
  isModalOpen,
  selectMapStopAreaViewState,
  setEditedStopAreaDataAction,
  setMapStopAreaViewStateAction,
} from '../../../redux';
import { EnrichedStopPlace } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import { mapPointToStopRegistryGeoJSON } from '../../../utils';
import { StopAreaFormState, useUpsertStopArea } from '../../forms/stop-area';
import { EditStopAreaLayerRef } from '../refTypes';
import { EditStopAreaModal } from './EditStopAreaModal';
import { mapStopAreaDataToFormState } from './StopAreaForm';
import { StopAreaPopup } from './StopAreaPopup';

type EditStopAreaLayerProps = {
  editedArea: EnrichedStopPlace;
  onEditingFinished?: () => void;
  onPopupClose: () => void;
};

export const EditStopAreaLayer = forwardRef<
  EditStopAreaLayerRef,
  EditStopAreaLayerProps
>(({ editedArea, onEditingFinished, onPopupClose }, ref) => {
  const { t } = useTranslation();

  const mapStopAreaViewState = useAppSelector(selectMapStopAreaViewState);
  const setMapStopAreaViewState = useAppAction(setMapStopAreaViewStateAction);

  const [isConfirmMoveDialogOpen, setIsConfirmMoveDialogOpen] = useState(false);
  const [isConfirmEditDialogOpen, setIsConfirmEditDialogOpen] = useState(false);
  const [newStopAreaLocation, setNewStopAreaLocation] = useState<{
    longitude: number;
    latitude: number;
  }>();
  const [stopAreaEditChanges, setStopAreaEditChanges] =
    useState<StopAreaFormState>();

  const { upsertStopArea, defaultErrorHandler } = useUpsertStopArea();
  const setEditedStopAreaData = useAppAction(setEditedStopAreaDataAction);

  const { setIsLoading } = useLoader(Operation.ModifyStopArea);

  const { isConfirmDeleteDialogOpen, openDeleteDialog, closeDeleteDialog } =
    useStopAreaDeletion();

  const isExistingStopArea = !!editedArea.id;
  const defaultDisplayedEditor = isExistingStopArea
    ? MapEntityEditorViewState.POPUP
    : MapEntityEditorViewState.CREATE;

  const isMoveStopAreaModeEnabled =
    mapStopAreaViewState === MapEntityEditorViewState.MOVE;
  useEffect(() => {
    if (!isMoveStopAreaModeEnabled) {
      setMapStopAreaViewState(defaultDisplayedEditor);
    }
  }, [
    defaultDisplayedEditor,
    isMoveStopAreaModeEnabled,
    setMapStopAreaViewState,
  ]);

  const onStartEditStopArea = () => {
    setMapStopAreaViewState(MapEntityEditorViewState.EDIT);
  };

  const onStartMoveStopArea = () => {
    setMapStopAreaViewState(MapEntityEditorViewState.MOVE);
  };

  const onCloseEditors = () => {
    setEditedStopAreaData(undefined);
    setMapStopAreaViewState(MapEntityEditorViewState.NONE);
    onPopupClose();
  };

  const onFinishEditing = () => {
    onCloseEditors();

    if (onEditingFinished) {
      onEditingFinished();
    }
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

  const doEditStopArea = async (state: StopAreaFormState) => {
    setIsLoading(true);
    try {
      await upsertStopArea({ stop: editedArea, state });
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const onEditStopArea = (state: StopAreaFormState) => {
    // Confirm if editing an existing area, but submit new area creation without confirmation.
    if (editedArea.id) {
      setStopAreaEditChanges(state);
      setIsConfirmEditDialogOpen(true);
    } else {
      doEditStopArea(state);
    }
  };

  const onCancelEditStopArea = () => {
    setIsConfirmEditDialogOpen(false);
  };

  const onConfirmEditStopArea = async () => {
    if (!stopAreaEditChanges) {
      return;
    }
    await doEditStopArea(stopAreaEditChanges);
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
    await doEditStopArea(stopAreaFormState as Required<StopAreaFormState>);
    setMapStopAreaViewState(MapEntityEditorViewState.POPUP);
    onFinishEditing();
  };

  useImperativeHandle(ref, () => ({
    onMoveStopArea: async (e: MapLayerMouseEvent) => onMoveStopArea(e),
  }));

  return (
    <>
      {mapStopAreaViewState === MapEntityEditorViewState.POPUP && (
        <StopAreaPopup
          area={editedArea}
          onDelete={openDeleteDialog}
          onEdit={onStartEditStopArea}
          onMove={onStartMoveStopArea}
          onClose={onCloseEditors}
        />
      )}

      {isModalOpen(mapStopAreaViewState) && (
        <EditStopAreaModal
          editedArea={editedArea}
          onCancel={onCloseEditors}
          onClose={onCloseEditors}
          onSubmit={onEditStopArea}
        />
      )}
      <DeleteStopArea
        stopArea={editedArea}
        isOpen={isConfirmDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onDeleteSuccess={onFinishEditing}
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
