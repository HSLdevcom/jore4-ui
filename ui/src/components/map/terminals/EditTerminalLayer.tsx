import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  isModalOpen,
  selectMapTerminalViewState,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
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

  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);

  const [isConfirmMoveDialogOpen, setIsConfirmMoveDialogOpen] = useState(false);
  const [isConfirmEditDialogOpen, setIsConfirmEditDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);

  const [newTerminalLocation, setNewTerminalLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [terminalEditChanges, setTerminalEditChanges] =
    useState<TerminalFormState | null>(null);

  const { doCreateTerminal } = useTerminalCreation();

  const onStartEditTerminal = () => {
    setMapTerminalViewState(MapEntityEditorViewState.EDIT);
  };

  const onStartMoveTerminal = () => {
    setMapTerminalViewState(MapEntityEditorViewState.MOVE);
  };

  const onEditTerminal = async (state: TerminalFormState) => {
    if (editedTerminal.id) {
      setTerminalEditChanges(state);
      setIsConfirmEditDialogOpen(true);
    } else {
      await doCreateTerminal(state);
      setNewTerminalLocation(null);
    }
  };

  const onMoveTerminal = (e: MapLayerMouseEvent) => {
    const [longitude, latitude] = e.lngLat.toArray();
    setNewTerminalLocation({ longitude, latitude });
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

      <NewTerminalMarker editedTerminal={editedTerminal} />

      <DeleteTerminal
        isOpen={isConfirmDeleteDialogOpen}
        setIsOpen={setIsConfirmDeleteDialogOpen}
        terminal={editedTerminal}
      />

      <MoveTerminal
        isOpen={isConfirmMoveDialogOpen}
        setIsOpen={setIsConfirmMoveDialogOpen}
        terminal={editedTerminal}
        newTerminalLocation={newTerminalLocation}
        setNewTerminalLocation={setNewTerminalLocation}
      />

      <EditTerminal
        isOpen={isConfirmEditDialogOpen}
        setIsOpen={setIsConfirmEditDialogOpen}
        terminal={editedTerminal}
        terminalEditChanges={terminalEditChanges}
        setTerminalEditChanges={setTerminalEditChanges}
      />
    </>
  );
});

EditTerminalLayer.displayName = 'EditTerminalLayer';
