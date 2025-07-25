import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  isModalOpen,
  selectMapTerminalViewState,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
} from '../../../redux';
import { EnrichedParentStopPlace } from '../../../types';
import { showSuccessToast } from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { useCreateTerminal } from '../../stop-registry/terminals/useCreateTerminal';
import { EditTerminalLayerRef } from '../refTypes';
import { EditTerminalModal } from './EditTerminalModal';
import { TerminalPopup } from './TerminalPopup';

type EditTerminalLayerProps = {
  readonly editedTerminal: EnrichedParentStopPlace;
  readonly onPopupClose: () => void;
};

export const EditTerminalLayer = forwardRef<
  EditTerminalLayerRef,
  EditTerminalLayerProps
>(({ editedTerminal, onPopupClose }, ref) => {
  const { t } = useTranslation();

  const mapTerminalViewState = useAppSelector(selectMapTerminalViewState);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);

  const { createTerminal, defaultErrorHandler } = useCreateTerminal();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

  const notImplemented = () => {
    throw new Error('Not implemented!');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onMoveTerminal = (e: MapLayerMouseEvent) => {
    notImplemented();
  };

  const onCloseEditors = () => {
    setEditedTerminalData(undefined);
    setMapTerminalViewState(MapEntityEditorViewState.NONE);
    onPopupClose();
  };

  const doCreateTerminal = async (state: TerminalFormState) => {
    setIsLoading(true);
    try {
      const createdTerminal = await createTerminal({
        state,
      });

      showSuccessToast(t('terminal.saveSuccess'));
      setEditedTerminalData(createdTerminal ?? undefined);
      setSelectedTerminalId(createdTerminal?.id ?? undefined);
      setMapTerminalViewState(MapEntityEditorViewState.POPUP);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
    setIsLoading(false);
  };

  const onEditTerminal = async (state: TerminalFormState) => {
    // Confirm if editing an existing terminal, but submit new terminal creation without confirmation.
    if (editedTerminal.id) {
      // TODO:Implement this when implementing terminal editing
    } else {
      await doCreateTerminal(state);
    }
  };

  useImperativeHandle(ref, () => ({
    onMoveTerminal: async (e: MapLayerMouseEvent) => onMoveTerminal(e),
  }));

  return (
    <>
      {mapTerminalViewState === MapEntityEditorViewState.POPUP && (
        <TerminalPopup
          onClose={onCloseEditors}
          onDelete={notImplemented}
          onEdit={notImplemented}
          onMove={notImplemented}
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
    </>
  );
});

EditTerminalLayer.displayName = 'EditTerminalLayer';
