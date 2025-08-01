import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  isModalOpen,
  selectDraftTerminalLocation,
  selectMapTerminalViewState,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setTerminalDraftEditsAction,
  setTerminalDraftLocationAction,
} from '../../../redux';
import { EnrichedParentStopPlace } from '../../../types';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { EditTerminalLayerRef } from '../refTypes';
import { DeleteTerminal } from './DeleteTerminal';
import { EditTerminal } from './EditTerminal';
import { EditTerminalModal } from './EditTerminalModal';
import { MoveTerminal } from './MoveTerminal';
import { NewTerminalMarker } from './NewTerminalMarker';
import { TerminalPopup } from './TerminalPopup';
import { useTerminalCreation } from './useTerminalCreation';

type EditTerminalLayerProps = {
  readonly editedTerminal: EnrichedParentStopPlace;
  readonly onPopupClose: () => void;
};

export const EditTerminalLayer = forwardRef<
  EditTerminalLayerRef,
  EditTerminalLayerProps
>(({ editedTerminal, onPopupClose }, ref) => {
  const mapTerminalViewState = useAppSelector(selectMapTerminalViewState);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const draftLocation = useAppSelector(selectDraftTerminalLocation);
  const setDraftLocation = useAppAction(setTerminalDraftLocationAction);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setTerminalDraftEdits = useAppAction(setTerminalDraftEditsAction);

  const [isConfirmMoveDialogOpen, setIsConfirmMoveDialogOpen] = useState(false);
  const [isConfirmEditDialogOpen, setIsConfirmEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const { doCreateTerminal } = useTerminalCreation();

  const onStartEditTerminal = () => {
    setMapTerminalViewState(MapEntityEditorViewState.EDIT);
  };

  const onStartMoveTerminal = () => {
    setMapTerminalViewState(MapEntityEditorViewState.MOVE);
  };

  const onEditTerminal = async (state: TerminalFormState) => {
    if (editedTerminal.id) {
      setTerminalDraftEdits(state);
      setIsConfirmEditDialogOpen(true);
    } else {
      await doCreateTerminal(state);
    }
  };

  const onMoveTerminal = (e: MapLayerMouseEvent) => {
    const [longitude, latitude] = e.lngLat.toArray();
    setDraftLocation({ longitude, latitude });
    setIsConfirmMoveDialogOpen(true);
  };

  const onDeleteTerminal = () => {
    setIsConfirmDeleteDialogOpen(true);
  };

  const onCloseEditors = () => {
    setEditedTerminalData(undefined);
    setMapTerminalViewState(MapEntityEditorViewState.NONE);
    onPopupClose();
  };

  useImperativeHandle(ref, () => ({
    onMoveTerminal: async (e: MapLayerMouseEvent) => onMoveTerminal(e),
  }));

  return (
    <>
      {mapTerminalViewState === MapEntityEditorViewState.POPUP && (
        <TerminalPopup
          onClose={onCloseEditors}
          onDelete={onDeleteTerminal}
          onEdit={onStartEditTerminal}
          onMove={onStartMoveTerminal}
          terminal={editedTerminal}
        />
      )}

      {isModalOpen(mapTerminalViewState) && (
        <EditTerminalModal
          editedTerminal={editedTerminal}
          onCancel={onCloseEditors}
          onClose={onCloseEditors}
          onSubmit={onEditTerminal}
        />
      )}

      {draftLocation &&
        mapTerminalViewState === MapEntityEditorViewState.CREATE && (
          <NewTerminalMarker point={draftLocation} />
        )}

      <DeleteTerminal
        isOpen={isConfirmDeleteDialogOpen}
        setIsOpen={setIsConfirmDeleteDialogOpen}
        terminal={editedTerminal}
      />

      <MoveTerminal
        isOpen={isConfirmMoveDialogOpen}
        setIsOpen={setIsConfirmMoveDialogOpen}
        terminal={editedTerminal}
      />

      <EditTerminal
        isOpen={isConfirmEditDialogOpen}
        setIsOpen={setIsConfirmEditDialogOpen}
        terminal={editedTerminal}
      />
    </>
  );
});

EditTerminalLayer.displayName = 'EditTerminalLayer';
