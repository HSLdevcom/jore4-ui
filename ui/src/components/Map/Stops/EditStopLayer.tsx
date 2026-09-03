import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import {
  MapEntityEditorViewState,
  Operation,
  closeTimingPlaceModalAction,
  isModalOpen,
  selectCopyStopId,
  selectEditedStopAreaData,
  selectMapStopSelection,
  selectMapStopViewState,
  setCopyStopIdAction,
  setDraftVehicleModeAction,
  setMapStopViewStateAction,
  setSelectedRouteIdAction,
  toggleStopSelectionAction,
  useAppSelector,
} from '../../../redux';
import { EnrichedStopPlace, Point } from '../../../types';
import {
  mapVehicleModeToTransportMode,
  parseVehicleMode,
  showSuccessToast,
} from '../../../utils';
import {
  StopFormState,
  StopModalStopAreaFormSchema,
} from '../../forms/stop/types';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../LinesAndRoutes/Common/ConflictResolverModal';
import { EditStoplayerRef } from '../refTypes';
import { useMapDataLayerLoader } from '../Utils/useMapDataLayerLoader';
import { CopyStop } from './CopyStop';
import { DeleteStopConfirmationDialog, useDeleteStopUtils } from './DeleteStop';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal/EditStopModal';
import { Stop, StopPopup } from './ExistingStops';
import { LineToActiveStopArea } from './LineToActiveStopArea';
import { LineToClosestInfraLink } from './LineToClosestInfraLink';
import { CreateChanges, EditChanges, StopInfoForEditingOnMap } from './Types';
import {
  isEditChanges,
  useCreateStopUtils,
  useEditStopUtils,
  useGetStopInfoForEditingOnMap,
} from './utils';

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
  draftVehicleMode: ReusableComponentsVehicleModeEnum | null,
  stopInfo: StopInfoForEditingOnMap | null,
): Partial<StopFormState> | null {
  const editedStopAreaData = useAppSelector(selectEditedStopAreaData);

  return useMemo(() => {
    if (draftLocation) {
      if (editedStopAreaData) {
        const vehicleMode =
          parseVehicleMode(editedStopAreaData.transportMode) ??
          draftVehicleMode ??
          ReusableComponentsVehicleModeEnum.Bus;

        return {
          ...draftLocation,
          stopArea:
            enrichedStopAreaToStopModalStopAreaFormSchema(editedStopAreaData),
          vehicleMode,
        };
      }

      return {
        ...draftLocation,
        vehicleMode: draftVehicleMode,
      };
    }

    if (stopInfo) {
      return stopInfo.formState;
    }

    return null;
  }, [draftLocation, draftVehicleMode, stopInfo, editedStopAreaData]);
}

type EditStopLayerProps = {
  readonly draftLocation: Point | null;
  readonly draftVehicleMode: ReusableComponentsVehicleModeEnum | null;
  readonly onEditingFinished: (netexId: string | null) => void;
  readonly onPopupClose: () => void;
  readonly selectedStopId: string | null;
};

export const EditStopLayer = forwardRef<EditStoplayerRef, EditStopLayerProps>(
  (
    {
      draftLocation,
      draftVehicleMode,
      onEditingFinished,
      onPopupClose,
      selectedStopId,
    },
    ref,
  ) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const copyStopId = useAppSelector(selectCopyStopId);
    const mapStopSelection = useAppSelector(selectMapStopSelection);
    const mapStopViewState = useAppSelector(selectMapStopViewState);

    const { stopInfo, loading } = useGetStopInfoForEditingOnMap(
      selectedStopId ?? copyStopId,
    );
    useMapDataLayerLoader(
      Operation.FetchStopInfo,
      !!stopInfo || (!selectedStopId && !copyStopId),
      loading,
    );

    const defaultValues = useDefaultValues(
      draftLocation,
      draftVehicleMode,
      stopInfo,
    );

    const [isConfirmCopyDialogOpen, setIsConfirmCopyDialogOpen] =
      useState(false);

    const onCloseEditors = () => {
      dispatch(setDraftVehicleModeAction(undefined));
      dispatch(setMapStopViewStateAction(MapEntityEditorViewState.NONE));
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
    } = useEditStopUtils(stopInfo, onFinishEditing);

    const {
      deleteChanges,
      isDeleting,
      onDeleteStop,
      onConfirmDelete,
      onCancelDelete,
    } = useDeleteStopUtils(stopInfo, onFinishEditing);

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
        dispatch(setMapStopViewStateAction(MapEntityEditorViewState.POPUP));
      } else {
        onCloseEditors();
      }
    };

    const onStartMoveStop = () => {
      dispatch(setMapStopViewStateAction(MapEntityEditorViewState.MOVE));
      dispatch(setSelectedRouteIdAction(undefined));
    };

    const onInitCopyStop = () => {
      if (selectedStopId) {
        dispatch(setCopyStopIdAction(selectedStopId));
        setIsConfirmCopyDialogOpen(true);
      }
    };

    const onToggleSelection = () => {
      if (selectedStopId && mapStopSelection.byResultSelection === false) {
        dispatch(toggleStopSelectionAction(selectedStopId));
        if (mapStopSelection.selected.includes(selectedStopId)) {
          showSuccessToast(t(($) => $.map.stopSelection.stopUnselected));
        } else {
          showSuccessToast(t(($) => $.map.stopSelection.stopSelected));
        }
      }
    };

    const currentConflicts = (createChanges ?? editChanges)?.conflicts;

    return (
      <>
        <LineToClosestInfraLink
          draftLocation={draftLocation}
          stop={stopInfo}
          vehicleMode={draftVehicleMode}
        />
        <LineToActiveStopArea.FromDraft draftLocation={draftLocation} />

        {draftLocation && draftVehicleMode && (
          <Stop
            isHighlighted
            longitude={draftLocation.longitude}
            latitude={draftLocation.latitude}
            mapStopViewState={mapStopViewState}
            selected
            activeTransportModes={[
              mapVehicleModeToTransportMode(draftVehicleMode),
            ]}
          />
        )}

        {mapStopViewState === MapEntityEditorViewState.POPUP && stopInfo && (
          <StopPopup
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(mapStopSelection.byResultSelection
              ? { isSelectable: false }
              : {
                  isSelectable: true,
                  isSelected: mapStopSelection.selected.includes(
                    selectedStopId as string,
                  ),
                  onToggleSelection,
                })}
            stop={stopInfo}
            onEdit={onStartEditingStop}
            onMove={onStartMoveStop}
            onDelete={onDeleteStop}
            onClose={onCloseEditors}
            onCopy={onInitCopyStop}
            isDeleting={isDeleting}
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
            onCancel={onCancelDelete}
            onConfirm={onConfirmDelete}
            deleteChanges={deleteChanges}
            isConfirming={isDeleting}
          />
        )}

        <CopyStop
          onCopyFinished={onEditingFinished}
          onPopupClose={onPopupClose}
          isConfirmCopyDialogOpen={isConfirmCopyDialogOpen}
          setIsConfirmCopyDialogOpen={setIsConfirmCopyDialogOpen}
          stopInfo={stopInfo}
        />
      </>
    );
  },
);

EditStopLayer.displayName = 'EditStopLayer';
