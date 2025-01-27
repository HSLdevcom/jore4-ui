import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import {
  PartialScheduledStopPointSetInput,
  StopWithLocation,
} from '../../../graphql';
import {
  CreateChanges,
  DeleteChanges,
  EditChanges,
  isEditChanges,
  useAppAction,
  useAppSelector,
  useCreateStop,
  useCreateStopPlace,
  useDeleteStop,
  useEditStop,
  useFilterStops,
  useLoader,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  Operation,
  closeTimingPlaceModalAction,
  selectIsMoveStopModeEnabled,
  setEditedStopDataAction,
  setIsMoveStopModeEnabledAction,
  setSelectedRouteIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { mapLngLatToGeoJSON, showSuccessToast } from '../../../utils';
import { mapStopDataToFormState } from '../../forms/stop/StopForm';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import { EditStoplayerRef } from '../refTypes';
import { DeleteStopConfirmationDialog } from './DeleteStopConfirmationDialog';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal';
import { StopPopup } from './StopPopup';

enum StopEditorViews {
  None,
  Popup,
  Modal,
}

interface Props {
  editedStopData: StopWithLocation;
  onEditingFinished?: () => void;
  onPopupClose?: () => void;
}

export const EditStopLayer = forwardRef<EditStoplayerRef, Props>(
  ({ editedStopData, onEditingFinished, onPopupClose }, ref) => {
    const [createChanges, setCreateChanges] = useState<CreateChanges>();
    const [editChanges, setEditChanges] = useState<EditChanges>();
    const [deleteChanges, setDeleteChanges] = useState<DeleteChanges>();
    const [displayedEditor, setDisplayedEditor] = useState<StopEditorViews>(
      StopEditorViews.None,
    );

    const dispatch = useDispatch();
    const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);

    const { t } = useTranslation();
    const { updateObservationDateByValidityPeriodIfNeeded } =
      useObservationDateQueryParam();
    const { updateStopPriorityFilterIfNeeded } = useFilterStops();

    const setSelectedStopId = useAppAction(setSelectedStopIdAction);
    const setEditedStopData = useAppAction(setEditedStopDataAction);
    const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
      Operation.CheckBrokenRoutes,
    );
    const { setIsLoading: setIsLoadingSaveStop } = useLoader(
      Operation.SaveStop,
    );

    const {
      mapCreateChangesToVariables,
      insertStopMutation,

      updateScheduledStopPointStopPlaceRefMutation,
    } = useCreateStop();
    const { mapToInsertStopPlaceVariables, insertStopPlaceMutation } =
      useCreateStopPlace();

    const { editStop, prepareEdit, defaultErrorHandler } = useEditStop();
    const {
      prepareDelete,
      mapDeleteChangesToVariables,
      removeStop,
      defaultErrorHandler: deleteErrorHandler,
    } = useDeleteStop();

    // computed values for the edited stop
    const isDraftStop = !editedStopData.scheduled_stop_point_id;
    const defaultDisplayedEditor = isDraftStop
      ? StopEditorViews.Modal
      : StopEditorViews.Popup;

    // when a stop is first edited, immediately show the proper editor view
    useEffect(() => {
      if (!isMoveStopModeEnabled) {
        setDisplayedEditor(defaultDisplayedEditor);
      }
    }, [defaultDisplayedEditor, isMoveStopModeEnabled]);

    const onCloseEditors = () => {
      setCreateChanges(undefined);
      setSelectedStopId(undefined);
      setEditedStopData(undefined);
      setDisplayedEditor(StopEditorViews.None);
      dispatch(closeTimingPlaceModalAction());
      onPopupClose?.();
    };

    const onFinishEditing = () => {
      setCreateChanges(undefined);
      setEditChanges(undefined);
      setDeleteChanges(undefined);
      onCloseEditors();

      if (onEditingFinished) {
        onEditingFinished();
      }
    };

    const onPrepareDelete = async (stopId: UUID) => {
      // we are removing stop that is already stored to backend
      try {
        const changes = await prepareDelete({
          stopId,
        });

        setDeleteChanges(changes);
      } catch (err) {
        deleteErrorHandler(err as Error);
      }
    };

    const onRemoveDraftStop = async () => {
      onFinishEditing();
    };

    const onRemoveStop = async (stopId?: UUID) => {
      if (stopId) {
        setIsLoadingBrokenRoutes(true);
        // we are removing stop that is already stored to backend
        await onPrepareDelete(stopId);
        setIsLoadingBrokenRoutes(false);
      } else {
        // we are removing a draft stop
        await onRemoveDraftStop();
      }
    };

    const onMoveStop = async (event: MapLayerMouseEvent) => {
      const { scheduled_stop_point_id: stopId, stop_place_ref: stopPlaceRef } =
        editedStopData;

      if (stopId) {
        // if this is a stop existing on the backend, also prepare the changes to be confirmed
        const patch: PartialScheduledStopPointSetInput = {
          measured_location: mapLngLatToGeoJSON(event.lngLat.toArray()),
        };
        setIsLoadingBrokenRoutes(true);
        try {
          const changes = await prepareEdit({
            stopId,
            stopPlaceRef,
            patch,
          });
          setEditChanges(changes);
        } catch (err) {
          defaultErrorHandler(err as Error);
        }
        setIsLoadingBrokenRoutes(false);
      } else {
        // for draft stops, just update the edited stop data
        setEditedStopData({
          ...editedStopData,
          measured_location: mapLngLatToGeoJSON(event.lngLat.toArray()),
        });
      }
    };

    const onCancelEdit = () => {
      dispatch(setIsMoveStopModeEnabledAction(false));
      setDisplayedEditor(StopEditorViews.Popup);
      setEditChanges(undefined);
    };

    /**
     * Inserts scheduled_stop_point, then inserts stopPlace to tiamat
     * Then updates the scheduled_stop_point's stop_place_ref
     * Note: this might all change if we get a transaction service, but for now
     * this is the way to go.
     */
    const doCreateStop = async (changes: CreateChanges) => {
      setIsLoadingSaveStop(true);
      try {
        const variables = mapCreateChangesToVariables(changes);
        const stopResult = await insertStopMutation(variables);

        const scheduledStopPointId =
          stopResult.data?.insert_service_pattern_scheduled_stop_point_one
            ?.scheduled_stop_point_id;

        if (!scheduledStopPointId) {
          // if for some reason the insert fails but does not throw an error
          // we can't continue with this creation process. This should not happen,
          // but needed for non-null-assertion for the updateMutation
          return;
        }

        const tiamatVariables = mapToInsertStopPlaceVariables({
          label: changes.stopToCreate.label,
          coordinates: changes.stopToCreate.measured_location.coordinates,
          validityStart: changes.stopToCreate.validity_start,
          validityEnd: changes.stopToCreate.validity_end,
          priority: changes.stopToCreate.priority,
        });
        const stopPlaceResult = await insertStopPlaceMutation(tiamatVariables);

        updateScheduledStopPointStopPlaceRefMutation({
          variables: {
            scheduled_stop_point_id: scheduledStopPointId,
            stop_place_ref:
              stopPlaceResult?.data?.stop_registry?.mutateStopPlace?.at(0)?.quays?.at(0)?.id,
          },
        });

        showSuccessToast(t('stops.saveSuccess'));
        updateObservationDateByValidityPeriodIfNeeded(changes.stopToCreate);
        updateStopPriorityFilterIfNeeded(changes.stopToCreate.priority);
        onFinishEditing();
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
    };

    const doEditStop = async (changes: EditChanges) => {
      setIsLoadingSaveStop(true);
      try {
        await editStop(changes);

        showSuccessToast(t('stops.editSuccess'));

        updateObservationDateByValidityPeriodIfNeeded(changes.editedStop);
        updateStopPriorityFilterIfNeeded(changes.editedStop.priority);

        onFinishEditing();
        dispatch(setIsMoveStopModeEnabledAction(false));
      } catch (err) {
        setIsLoadingSaveStop(false);
        defaultErrorHandler(err as Error);
      }
    };

    // we are removing stop that is already stored to backend
    const doDeleteStop = async (changes: DeleteChanges) => {
      try {
        const variables = mapDeleteChangesToVariables(changes);
        await removeStop(variables);

        showSuccessToast(t('stops.removeSuccess'));
        onFinishEditing();
      } catch (err) {
        deleteErrorHandler(err as Error);
      }
    };

    const createChangesValid = (changes: CreateChanges) => {
      return !changes.conflicts?.length;
    };

    const onStopFormSubmit = async (changes: EditChanges | CreateChanges) => {
      // for editing, it'll need to show a confirmation windows
      if (isEditChanges(changes)) {
        setEditChanges(changes);
        return;
      }

      setCreateChanges(changes);

      if (createChangesValid(changes)) {
        // for creating, it'll execute the creation if changes were valid
        await doCreateStop(changes);
      }
    };

    const getActiveChanges = () => {
      if (createChanges && editChanges) {
        throw new Error('Undefined state');
      }
      return createChanges ?? editChanges;
    };

    const getCurrentConflicts = () => {
      const changes = getActiveChanges();

      return changes?.conflicts;
    };

    const hideEditors = () => {
      setDisplayedEditor(StopEditorViews.None);
      dispatch(setSelectedRouteIdAction(undefined));
    };

    const onStartMoveStop = () => {
      hideEditors();
      dispatch(setIsMoveStopModeEnabledAction(true));
    };

    useImperativeHandle(ref, () => ({
      onMoveStop: async (e: MapLayerMouseEvent) => onMoveStop(e),
    }));

    const currentConflicts = getCurrentConflicts();
    return (
      <>
        {displayedEditor === StopEditorViews.Popup && (
          <StopPopup
            // If displaying popup, editedStopData contains all fields needed by the popup.
            // StopWithLocation type has many fields (e.g. label) optional, so need to cast here.
            stop={editedStopData as Required<StopWithLocation>}
            onEdit={() => {
              setDisplayedEditor(StopEditorViews.Modal);
            }}
            onMove={onStartMoveStop}
            onDelete={() =>
              onRemoveStop(editedStopData.scheduled_stop_point_id)
            }
            onClose={onCloseEditors}
          />
        )}
        {displayedEditor === StopEditorViews.Modal && (
          <EditStopModal
            stopAreaId={editedStopData.stop_place?.at(0)?.groups?.at(0)?.id}
            defaultValues={mapStopDataToFormState(editedStopData)}
            stopPlaceRef={editedStopData.stop_place_ref}
            onCancel={onCloseEditors}
            onClose={onCloseEditors}
            onSubmit={onStopFormSubmit}
          />
        )}
        {currentConflicts?.length && (
          <ConflictResolverModal
            onClose={() => {
              setCreateChanges(undefined);
              setEditChanges(undefined);
            }}
            conflicts={currentConflicts?.map(mapStopToCommonConflictItem)}
          />
        )}
        {editChanges && !editChanges?.conflicts?.length && (
          <EditStopConfirmationDialog
            isOpen={!!editChanges}
            onCancel={onCancelEdit}
            onConfirm={() => doEditStop(editChanges)}
            editChanges={editChanges}
          />
        )}
        {deleteChanges && (
          <DeleteStopConfirmationDialog
            isOpen={!!deleteChanges}
            onCancel={() => setDeleteChanges(undefined)}
            onConfirm={() => doDeleteStop(deleteChanges)}
            deleteChanges={deleteChanges}
          />
        )}
      </>
    );
  },
);

EditStopLayer.displayName = 'EditStopLayer';
