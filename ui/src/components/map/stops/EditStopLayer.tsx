import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  closeTimingPlaceModalAction,
  isCopyMode,
  isModalOpen,
  selectCopyStopId,
  selectEditedStopAreaData,
  selectMapStopViewState,
  setCopyStopIdAction,
  setMapStopViewStateAction,
  setSelectedRouteIdAction,
} from '../../../redux';
import { EnrichedStopPlace, Point } from '../../../types';
import { useMapDataLayerLoader } from '../../common/hooks';
import {
  StopFormState,
  StopModalStopAreaFormSchema,
} from '../../forms/stop/types';
import {
  StopInfoForEditingOnMap,
  useGetStopInfoForEditingOnMap,
} from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import { EditStoplayerRef } from '../refTypes';
import { CopyStopConfirmationDialog } from './CopyStopConfirmationDialog';
import { CopyStopModal } from './CopyStopModal';
import { DeleteStopConfirmationDialog } from './DeleteStopConfirmationDialog';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal';
import {
  CreateChanges,
  EditChanges,
  isEditChanges,
  useCreateStopUtils,
  useDeleteStopUtils,
  useEditStopUtils,
} from './hooks';
import { useMapCopyStopUtils } from './hooks/useMapCopyStopUtils';
import { LineToActiveStopArea } from './LineToActiveStopArea';
import { LineToClosestInfraLink } from './LineToClosestInfraLink';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

function enrichedStopAreaToStopModalStopAreaFormSchema(
  editedStopAreaData: EnrichedStopPlace,
): StopModalStopAreaFormSchema | null {
  if (
    !editedStopAreaData.id ||
    !editedStopAreaData.privateCode?.value ||
    !editedStopAreaData.validityStart
  ) {
    return null;
  }

  return {
    netexId: editedStopAreaData.id,
    privateCode: editedStopAreaData.privateCode.value,

    validityStart: editedStopAreaData.validityStart,
    validityEnd: editedStopAreaData.validityEnd ?? null,

    nameFin: editedStopAreaData.name ?? null,
    nameSwe: editedStopAreaData.nameSwe ?? null,
    nameEng: editedStopAreaData.nameEng ?? null,

    longNameFin: editedStopAreaData.nameLongFin ?? null,
    longNameSwe: editedStopAreaData.nameLongSwe ?? null,
    longNameEng: editedStopAreaData.nameLongEng ?? null,

    abbreviationFin: editedStopAreaData.abbreviationFin ?? null,
    abbreviationSwe: editedStopAreaData.abbreviationSwe ?? null,
    abbreviationEng: editedStopAreaData.abbreviationEng ?? null,
  };
}

function useDefaultValues(
  draftLocation: Point | null,
  stopInfo: StopInfoForEditingOnMap | null,
): Partial<StopFormState> | null {
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);

  return useMemo(() => {
    if (draftLocation) {
      if (editedStopAreaData) {
        return {
          ...draftLocation,
          stopArea:
            enrichedStopAreaToStopModalStopAreaFormSchema(editedStopAreaData),
        };
      }

      return draftLocation;
    }

    if (stopInfo) {
      return stopInfo.formState;
    }

    return null;
  }, [draftLocation, stopInfo, editedStopAreaData]);
}

type EditStopLayerProps = {
  readonly draftLocation: Point | null;
  readonly onEditingFinished: (netexId: string | null) => void;
  readonly onPopupClose: () => void;
  readonly selectedStopId: string | null;
};

export const EditStopLayer = forwardRef<EditStoplayerRef, EditStopLayerProps>(
  ({ draftLocation, onEditingFinished, onPopupClose, selectedStopId }, ref) => {
    const dispatch = useDispatch();

    const copyStopId = useAppSelector(selectCopyStopId);
    const mapStopViewState = useAppSelector(selectMapStopViewState);
    const setMapStopViewState = useAppAction(setMapStopViewStateAction);
    const setCopyStopId = useAppAction(setCopyStopIdAction);

    const { stopInfo, loading } = useGetStopInfoForEditingOnMap(
      selectedStopId ?? copyStopId,
    );
    useMapDataLayerLoader(
      Operation.FetchStopInfo,
      !!stopInfo || (!selectedStopId && !copyStopId),
      loading,
    );

    const defaultValues = useDefaultValues(draftLocation, stopInfo);

    const [copyDialogOpen, setCopyDialogOpen] = useState(false);

    const onCloseEditors = () => {
      setMapStopViewState(MapEntityEditorViewState.NONE);
      dispatch(closeTimingPlaceModalAction());
      onPopupClose();
    };

    const onFinishEditing = (netexId: string | null) => {
      onCloseEditors();
      onEditingFinished(netexId);
    };

    const { createChanges, onCreateStop, onCancelCreate } =
      useCreateStopUtils(onFinishEditing);

    const {
      editChanges,
      onStartEditingStop,
      onMoveStop,
      onProcessEditChanges,
      onConfirmEdit,
      onCancelEdit,
    } = useEditStopUtils(stopInfo, setMapStopViewState, onFinishEditing);

    const { deleteChanges, onDeleteStop, onConfirmDelete, onCancelDelete } =
      useDeleteStopUtils(stopInfo, onFinishEditing);

    const {
      defaultStopFormValues,
      onStartCopyStop,
      onCancelCopyStop,
      onCloseCopyModal,
      onCopyStopFormSubmit,
    } = useMapCopyStopUtils(
      stopInfo,
      onEditingFinished,
      onPopupClose,
      setCopyDialogOpen,
    );

    if (createChanges && editChanges) {
      throw new Error('Undefined state');
    }

    useImperativeHandle(ref, () => ({
      onMoveStop: async (e: MapLayerMouseEvent) => onMoveStop(e),
    }));

    const onStopFormSubmit = async (changes: EditChanges | CreateChanges) => {
      // for editing, it'll need to show a confirmation windows
      if (isEditChanges(changes)) {
        return onProcessEditChanges(changes);
      }

      return onCreateStop(changes);
    };

    const onCloseModal = () => {
      if (stopInfo) {
        setMapStopViewState(MapEntityEditorViewState.POPUP);
      } else {
        onCloseEditors();
      }
    };

    const onStartMoveStop = () => {
      setMapStopViewState(MapEntityEditorViewState.MOVE);
      dispatch(setSelectedRouteIdAction(undefined));
    };

    const onInitCopyStop = () => {
      if (selectedStopId) {
        setCopyStopId(selectedStopId);
        setCopyDialogOpen(true);
      }
    };

    const currentConflicts = (createChanges ?? editChanges)?.conflicts;

    return (
      <>
        <LineToClosestInfraLink draftLocation={draftLocation} stop={stopInfo} />
        <LineToActiveStopArea.FromDraft draftLocation={draftLocation} />

        {draftLocation && (
          <Stop
            isHighlighted
            longitude={draftLocation.longitude}
            latitude={draftLocation.latitude}
            mapStopViewState={mapStopViewState}
            selected
            vehicleMode={ReusableComponentsVehicleModeEnum.Bus}
          />
        )}

        {mapStopViewState === MapEntityEditorViewState.POPUP && stopInfo && (
          <StopPopup
            stop={stopInfo}
            onEdit={onStartEditingStop}
            onMove={onStartMoveStop}
            onDelete={onDeleteStop}
            onClose={onCloseEditors}
            onCopy={onInitCopyStop}
          />
        )}

        {isModalOpen(mapStopViewState) && defaultValues && (
          <EditStopModal
            defaultValues={defaultValues}
            editing={!!selectedStopId}
            onCancel={onCloseModal}
            onClose={onCloseModal}
            onSubmit={onStopFormSubmit}
          />
        )}

        {currentConflicts?.length && (
          <ConflictResolverModal
            onClose={() => {
              onCancelCreate();
              onCancelEdit?.();
            }}
            conflicts={currentConflicts?.map(mapStopToCommonConflictItem)}
          />
        )}

        {editChanges && !editChanges.conflicts?.length && (
          <EditStopConfirmationDialog
            isOpen
            onCancel={onCancelEdit}
            onConfirm={onConfirmEdit}
            editChanges={editChanges}
          />
        )}

        {deleteChanges && (
          <DeleteStopConfirmationDialog
            isOpen
            onCancel={onCancelDelete}
            onConfirm={onConfirmDelete}
            deleteChanges={deleteChanges}
          />
        )}

        <CopyStopConfirmationDialog
          isOpen={copyDialogOpen}
          onConfirm={onStartCopyStop}
          onCancel={onCancelCopyStop}
        />

        {isCopyMode(mapStopViewState) && !!defaultStopFormValues && (
          <CopyStopModal
            defaultValues={defaultStopFormValues}
            onCancel={onCloseCopyModal}
            onClose={onCloseCopyModal}
            onSubmit={onCopyStopFormSubmit}
          />
        )}
      </>
    );
  },
);

EditStopLayer.displayName = 'EditStopLayer';
