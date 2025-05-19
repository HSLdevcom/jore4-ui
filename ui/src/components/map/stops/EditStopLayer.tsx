import noop from 'lodash/noop';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import {
  CreateChanges,
  EditChanges,
  isEditChanges,
  useAppAction,
  useAppSelector,
  useMapDataLayerLoader,
} from '../../../hooks';
import {
  MapEntityEditorViewState,
  Operation,
  closeTimingPlaceModalAction,
  isModalOpen,
  selectMapStopViewState,
  setMapStopViewStateAction,
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
import { StopPopup } from './StopPopup';
import { useCreateStopUtils } from './useCreateStopUtils';
import { useDeleteStopUtils } from './useDeleteStopUtils';
import { useEditStopUtils } from './useEditStopUtils';

type EditStopLayerProps = {
  readonly draftLocation: Point | null;
  readonly onEditingFinished: (netexId: string | null) => void;
  readonly onPopupClose: () => void;
  readonly selectedStopId: string | null;
};

export const EditStopLayer = forwardRef<EditStoplayerRef, EditStopLayerProps>(
  ({ draftLocation, onEditingFinished, onPopupClose, selectedStopId }, ref) => {
    const { stopInfo, loading } = useGetStopInfoForEditingOnMap(selectedStopId);
    useMapDataLayerLoader(
      Operation.FetchStopInfo,
      !!stopInfo || !selectedStopId,
      loading,
    );

    const dispatch = useDispatch();

    const mapStopViewState = useAppSelector(selectMapStopViewState);
    const setMapStopViewState = useAppAction(setMapStopViewStateAction);

    // computed values for the edited stop
    const isExistingStop = !!selectedStopId;
    const defaultDisplayedEditor = isExistingStop
      ? MapEntityEditorViewState.POPUP
      : MapEntityEditorViewState.CREATE;

    const defaultValues = draftLocation ?? stopInfo?.formState;

    // when a stop is first edited, immediately show the proper editor view
    const isMoveStopModeEnabled =
      mapStopViewState === MapEntityEditorViewState.MOVE;
    useEffect(() => {
      if (!isMoveStopModeEnabled) {
        setMapStopViewState(defaultDisplayedEditor);
      }
    }, [defaultDisplayedEditor, isMoveStopModeEnabled, setMapStopViewState]);

    const onCloseEditors = () => {
      setMapStopViewState(MapEntityEditorViewState.NONE);
      dispatch(closeTimingPlaceModalAction());
      onPopupClose();
    };

    const onFinishEditing = (netextId: string | null) => {
      onCloseEditors();
      onEditingFinished(netextId);
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
      setMapStopViewState(MapEntityEditorViewState.MOVE);
      dispatch(setSelectedRouteIdAction(undefined));
    };

    const currentConflicts = (createChanges ?? editChanges)?.conflicts;

    return (
      <>
        <LineToClosestInfraLink draftLocation={draftLocation} stop={stopInfo} />

        {draftLocation && (
          <Stop
            isHighlighted
            longitude={draftLocation.longitude}
            latitude={draftLocation.latitude}
            mapStopViewState={mapStopViewState}
            onClick={noop}
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
          />
        )}

        {isModalOpen(mapStopViewState) && defaultValues && (
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
