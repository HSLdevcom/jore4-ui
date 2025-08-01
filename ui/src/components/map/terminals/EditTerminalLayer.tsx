import { MapLayerMouseEvent } from 'maplibre-gl';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMap } from 'react-map-gl/maplibre';
import { useAppAction, useAppSelector, useLoader } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  isModalOpen,
  selectMapTerminalViewState,
  setEditedTerminalDataAction,
  setMapTerminalViewStateAction,
  setSelectedTerminalIdAction,
  setTerminalDraftLocationAction,
} from '../../../redux';
import { EnrichedParentStopPlace, Point } from '../../../types';
import { ConfirmationDialog } from '../../../uiComponents';
import {
  getGeometryPoint,
  mapPointToStopRegistryGeoJSON,
  showSuccessToast,
} from '../../../utils';
import { TerminalFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/schema';
import { mapTerminalDataToFormState } from '../../stop-registry/terminals/components/basic-details/basic-details-form/TerminalDetailsEdit';
import { useCreateTerminal } from '../../stop-registry/terminals/useCreateTerminal';
import { EditTerminalLayerRef } from '../refTypes';
import { useUpdateTerminalMapDetails } from '../utils/useUpdateTerminalMapDetails';
import { DeleteTerminal } from './DeleteTerminal';
import { EditTerminalModal } from './EditTerminalModal';
import { NewTerminalMarker } from './NewTerminalMarker';
import { TerminalPopup } from './TerminalPopup';

type EditTerminalLayerProps = {
  readonly editedTerminal: EnrichedParentStopPlace;
  readonly draftLocation: Point | null;
  readonly onPopupClose: () => void;
};

export const EditTerminalLayer = forwardRef<
  EditTerminalLayerRef,
  EditTerminalLayerProps
>(({ editedTerminal, draftLocation, onPopupClose }, ref) => {
  const { t } = useTranslation();

  const map = useMap();

  const mapTerminalViewState = useAppSelector(selectMapTerminalViewState);
  const setMapTerminalViewState = useAppAction(setMapTerminalViewStateAction);

  const setSelectedTerminalId = useAppAction(setSelectedTerminalIdAction);
  const setEditedTerminalData = useAppAction(setEditedTerminalDataAction);
  const setDraftLocation = useAppAction(setTerminalDraftLocationAction);

  const { createTerminal, defaultErrorHandler: createTerminalErrorHandler } =
    useCreateTerminal();
  const {
    updateTerminalMapDetails,
    defaultErrorHandler: updateTerminalErrorHandler,
  } = useUpdateTerminalMapDetails();

  const { setIsLoading } = useLoader(Operation.ModifyTerminal);

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
      createTerminalErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const doUpdateTerminal = async (state: TerminalFormState) => {
    setIsLoading(true);
    try {
      const updatedTerminal = await updateTerminalMapDetails({
        terminal: editedTerminal,
        state,
        selectedStops: state.selectedStops,
      });

      setEditedTerminalData(updatedTerminal ?? undefined);
      setSelectedTerminalId(updatedTerminal?.id ?? undefined);
      setMapTerminalViewState(MapEntityEditorViewState.POPUP);
    } catch (err) {
      updateTerminalErrorHandler(err as Error, state);
    }
    setIsLoading(false);
  };

  const onStartEditTerminal = () => {
    const point = getGeometryPoint(editedTerminal.geometry);
    if (point) {
      map.current?.easeTo({
        center: {
          lon: point.longitude,
          lat: point.latitude,
        },
      });
    }

    setMapTerminalViewState(MapEntityEditorViewState.EDIT);
  };

  const onCancelEditTerminal = () => {
    setIsConfirmEditDialogOpen(false);
  };

  const onConfirmEditTerminal = async () => {
    if (!terminalEditChanges) {
      return;
    }

    await doUpdateTerminal(terminalEditChanges);
    setIsConfirmEditDialogOpen(false);
    setTerminalEditChanges(null);

    map.current?.easeTo({
      center: {
        lon: terminalEditChanges.longitude,
        lat: terminalEditChanges.latitude,
      },
    });
  };

  const onStartMoveTerminal = () => {
    setMapTerminalViewState(MapEntityEditorViewState.MOVE);
  };

  const onCancelMoveTerminal = () => {
    setIsConfirmMoveDialogOpen(false);
    setMapTerminalViewState(MapEntityEditorViewState.POPUP);
  };

  const onConfirmMoveStopArea = async () => {
    if (!newTerminalLocation) {
      return;
    }

    const { longitude, latitude } = newTerminalLocation;
    const geometry = mapPointToStopRegistryGeoJSON({
      longitude,
      latitude,
    });

    const terminalFormState = mapTerminalDataToFormState({
      ...editedTerminal,
      geometry,
    });

    await doUpdateTerminal(terminalFormState);
    setIsConfirmMoveDialogOpen(false);
    setNewTerminalLocation(null);

    map.current?.easeTo({
      center: {
        lon: longitude,
        lat: latitude,
      },
    });
  };

  const onCloseEditors = () => {
    setEditedTerminalData(undefined);
    setMapTerminalViewState(MapEntityEditorViewState.NONE);
    onPopupClose();
  };

  const onEditTerminal = async (state: TerminalFormState) => {
    if (editedTerminal.id) {
      setTerminalEditChanges(state);
      setIsConfirmEditDialogOpen(true);
    } else {
      await doCreateTerminal(state);
      setDraftLocation(undefined);
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

      {draftLocation && <NewTerminalMarker point={draftLocation} />}

      <DeleteTerminal
        isOpen={isConfirmDeleteDialogOpen}
        setIsOpen={setIsConfirmDeleteDialogOpen}
        terminal={editedTerminal}
      />

      <ConfirmationDialog
        isOpen={isConfirmMoveDialogOpen}
        onCancel={onCancelMoveTerminal}
        onConfirm={onConfirmMoveStopArea}
        title={t('confirmEditTerminalDialog.title')}
        description={t('confirmEditTerminalDialog.description', {
          terminalName: editedTerminal.name ?? '',
        })}
        confirmText={t('confirmEditTerminalDialog.confirmText')}
        cancelText={t('cancel')}
        widthClassName="w-235"
      />

      <ConfirmationDialog
        isOpen={isConfirmEditDialogOpen}
        onCancel={onCancelEditTerminal}
        onConfirm={onConfirmEditTerminal}
        title={t('confirmEditTerminalDialog.title')}
        description={t('confirmEditTerminalDialog.description', {
          terminalName: editedTerminal.name ?? '',
        })}
        confirmText={t('confirmEditTerminalDialog.confirmText')}
        cancelText={t('cancel')}
        widthClassName="w-235"
      />
    </>
  );
});

EditTerminalLayer.displayName = 'EditTerminalLayer';
