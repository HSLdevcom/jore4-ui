import noop from 'lodash/noop';
import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
} from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import {
  CreateChanges,
  EditChanges,
  isEditChanges,
  useAppSelector,
  useMapDataLayerLoader,
} from '../../../hooks';
import {
  Operation,
  closeTimingPlaceModalAction,
  selectIsMoveStopModeEnabled,
  setIsMoveStopModeEnabledAction,
  setSelectedRouteIdAction,
} from '../../../redux';
import { Point } from '../../../types';
import { useGetStopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import { EditStoplayerRef } from '../refTypes';
import { DeleteStopConfirmationDialog } from './DeleteStopConfirmationDialog';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal';
import { LineToClosestInfraLink } from './LineToClosestInfraLink';
import { Stop } from './Stop';
import { StopEditorViews } from './StopEditorViews';
import { StopPopup } from './StopPopup';
import { useCreateStopUtils } from './useCreateStopUtils';
import { useDeleteStopUtils } from './useDeleteStopUtils';
import { useEditStopUtils } from './useEditStopUtils';

type EditStopLayerProps = {
  readonly displayedEditor: StopEditorViews;
  readonly draftLocation: Point | null;
  readonly onEditingFinished: () => void;
  readonly onPopupClose: () => void;
  readonly selectedStopId: string | null;
  readonly setDisplayedEditor: Dispatch<SetStateAction<StopEditorViews>>;
};

export const EditStopLayer = forwardRef<EditStoplayerRef, EditStopLayerProps>(
  (
    {
      displayedEditor,
      draftLocation,
      onEditingFinished,
      onPopupClose,
      selectedStopId,
      setDisplayedEditor,
    },
    ref,
  ) => {
    const { stopInfo, loading } = useGetStopInfoForEditingOnMap(selectedStopId);
    useMapDataLayerLoader(
      Operation.FetchStopInfo,
      !!stopInfo || !selectedStopId,
      loading,
    );

    const dispatch = useDispatch();
    const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);

    // computed values for the edited stop
    const isDraftStop = !!draftLocation;
    const defaultDisplayedEditor = isDraftStop
      ? StopEditorViews.Modal
      : StopEditorViews.Popup;

    const defaultValues = draftLocation ?? stopInfo?.formState;

    // when a stop is first edited, immediately show the proper editor view
    useEffect(() => {
      if (!isMoveStopModeEnabled) {
        setDisplayedEditor(defaultDisplayedEditor);
      }
    }, [defaultDisplayedEditor, isMoveStopModeEnabled, setDisplayedEditor]);

    const onCloseEditors = () => {
      setDisplayedEditor(StopEditorViews.None);
      dispatch(closeTimingPlaceModalAction());
      onPopupClose();
    };

    const onFinishEditing = () => {
      onCloseEditors();
      onEditingFinished();
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
    } = useEditStopUtils(stopInfo, setDisplayedEditor, onFinishEditing);
    const { deleteChanges, onDeleteStop, onConfirmDelete, onCancelDelete } =
      useDeleteStopUtils(stopInfo, onFinishEditing);

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

    const onStartMoveStop = () => {
      setDisplayedEditor(StopEditorViews.None);
      dispatch(setSelectedRouteIdAction(undefined));
      dispatch(setIsMoveStopModeEnabledAction(true));
    };

    const currentConflicts = (createChanges ?? editChanges)?.conflicts;

    return (
      <>
        <LineToClosestInfraLink draftLocation={draftLocation} stop={stopInfo} />

        {draftLocation && (
          <Stop
            onClick={noop}
            longitude={draftLocation.longitude}
            latitude={draftLocation.latitude}
            selected
            isHighlighted
            vehicleMode={ReusableComponentsVehicleModeEnum.Bus}
          />
        )}

        {displayedEditor === StopEditorViews.Popup && stopInfo && (
          <StopPopup
            stop={stopInfo}
            onEdit={onStartEditingStop}
            onMove={onStartMoveStop}
            onDelete={onDeleteStop}
            onClose={onCloseEditors}
          />
        )}

        {displayedEditor === StopEditorViews.Modal && defaultValues && (
          <EditStopModal
            defaultValues={defaultValues}
            editing={!!selectedStopId}
            onCancel={onCloseEditors}
            onClose={onCloseEditors}
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
      </>
    );
  },
);

EditStopLayer.displayName = 'EditStopLayer';
