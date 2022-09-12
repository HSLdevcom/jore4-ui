import React, { Ref, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapEvent } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { useDispatch } from 'react-redux';
import { StopPopupInfoFragment } from '../../../generated/graphql';
import { ScheduledStopPointSetInput, StopWithLocation } from '../../../graphql';
import {
  CreateChanges,
  DeleteChanges,
  EditChanges,
  isEditChanges,
  useAppAction,
  useAppSelector,
  useCreateStop,
  useDeleteStop,
  useEditStop,
  useLoader,
  useObservationDateQueryParam,
} from '../../../hooks';
import {
  Operation,
  selectIsMoveStopModeEnabled,
  setEditedStopDataAction,
  setIsMoveStopModeEnabledAction,
  setSelectedRouteIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  mapLngLatToGeoJSON,
  removeFromApolloCache,
  showSuccessToast,
} from '../../../utils';
import { mapStopDataToFormState } from '../../forms/stop/StopForm';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
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
  ref: Ref<ExplicitAny>;
}

export const EditStopLayer: React.FC<Props> = React.forwardRef(
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
    const { ensureObservationDateWithinValidityPeriod } =
      useObservationDateQueryParam();

    const setSelectedStopId = useAppAction(setSelectedStopIdAction);
    const setEditedStopData = useAppAction(setEditedStopDataAction);
    const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
      Operation.CheckBrokenRoutes,
    );
    const { setIsLoading: setIsLoadingSaveStop } = useLoader(
      Operation.SaveStop,
    );

    const { mapCreateChangesToVariables, insertStopMutation } = useCreateStop();
    const {
      prepareEdit,
      mapEditChangesToVariables,
      editStopMutation,
      defaultErrorHandler,
    } = useEditStop();
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
    }, [
      defaultDisplayedEditor,
      dispatch,
      editedStopData,
      isMoveStopModeEnabled,
    ]);

    const onCloseEditors = () => {
      setCreateChanges(undefined);
      setSelectedStopId(undefined);
      setEditedStopData(undefined);
      setDisplayedEditor(StopEditorViews.None);
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

    const onMoveStop = async (event: CallbackEvent) => {
      const stopId = editedStopData.scheduled_stop_point_id;
      if (stopId) {
        // if this is a stop existing on the backend, also prepare the changes to be confirmed
        const patch: ScheduledStopPointSetInput = {
          measured_location: mapLngLatToGeoJSON(event.lngLat),
        };
        setIsLoadingBrokenRoutes(true);
        try {
          const changes = await prepareEdit({
            stopId,
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
          measured_location: mapLngLatToGeoJSON(event.lngLat),
        });
      }
    };

    const onCancelEdit = () => {
      dispatch(setIsMoveStopModeEnabledAction(false));
      setDisplayedEditor(StopEditorViews.Popup);
      setEditChanges(undefined);
    };

    const doCreateStop = async (changes: CreateChanges) => {
      setIsLoadingSaveStop(true);
      try {
        const variables = mapCreateChangesToVariables(changes);
        await insertStopMutation(variables);

        showSuccessToast(t('stops.saveSuccess'));
        ensureObservationDateWithinValidityPeriod(changes.stopToCreate);
        onFinishEditing();
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      setIsLoadingSaveStop(false);
    };

    const doEditStop = async (changes: EditChanges) => {
      setIsLoadingSaveStop(true);
      try {
        const variables = mapEditChangesToVariables(changes);

        await editStopMutation({
          variables,
          update(cache) {
            removeFromApolloCache(cache, {
              infrastructure_link_id:
                variables.stop_patch.located_on_infrastructure_link_id,
              __typename: 'infrastructure_network_infrastructure_link',
            });
          },
        });

        showSuccessToast(t('stops.editSuccess'));
        ensureObservationDateWithinValidityPeriod(changes.editedStop);
        onFinishEditing();
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
      dispatch(setIsMoveStopModeEnabledAction(false));
      setIsLoadingSaveStop(false);
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
      return createChanges || editChanges;
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
      onMoveStop: async (e: MapEvent) => onMoveStop(e),
    }));

    const currentConflicts = getCurrentConflicts();
    return (
      <>
        {displayedEditor === StopEditorViews.Popup && (
          <StopPopup
            // If displaying popup, editedStopData contains all StopPopupInfoFragment fields
            // StopWithLocation type has many fields (e.g. label) optional, so need to cast here.
            stop={editedStopData as StopPopupInfoFragment}
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
            defaultValues={mapStopDataToFormState(editedStopData)}
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
