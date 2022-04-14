import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { ScheduledStopPointSetInput, StopWithLocation } from '../../../graphql';
import {
  CreateChanges,
  DeleteChanges,
  EditChanges,
  isEditChanges,
  useAppAction,
  useCreateStop,
  useDeleteStop,
  useEditStop,
} from '../../../hooks';
import {
  setEditedStopDataAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
  showSuccessToast,
} from '../../../utils';
// eslint-disable-next-line import/no-cycle
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../ConflictResolverModal';
import { mapStopDataToFormState } from '../../forms/StopForm';
import { DeleteStopConfirmationDialog } from './DeleteStopConfirmationDialog';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal';
import { Stop } from './Stop';
import { StopPopup } from './StopPopup';

enum StopEditorViews {
  None,
  Popup,
  Modal,
}

interface Props {
  editedStopData: StopWithLocation;
  onEditingFinished?: () => void;
}

export const EditStopLayer: React.FC<Props> = ({
  editedStopData,
  onEditingFinished,
}) => {
  const [isStopDraggable, setIsStopDraggable] = useState(false);
  const [deleteChanges, setDeleteChanges] = useState<DeleteChanges>();
  const [editChanges, setEditChanges] = useState<EditChanges>();
  const [displayedEditor, setDisplayedEditor] = useState<StopEditorViews>(
    StopEditorViews.None,
  );

  const { t } = useTranslation();

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);

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
  const editedStopLocation = mapLngLatToPoint(
    editedStopData.measured_location.coordinates,
  );

  // when a stop is first edited, immediately show the proper editor view
  useEffect(() => {
    setDisplayedEditor(defaultDisplayedEditor);
  }, [defaultDisplayedEditor, editedStopData]);

  const onStopClicked = () => {
    setSelectedStopId(editedStopData?.scheduled_stop_point_id);

    // for draft stops, we show the modal immediately
    setDisplayedEditor(defaultDisplayedEditor);
  };

  const onCloseEditors = () => {
    setSelectedStopId(undefined);
    setEditedStopData(undefined);
    setDisplayedEditor(StopEditorViews.None);
  };

  const onFinishEditing = () => {
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
      // we are removing stop that is already stored to backend
      await onPrepareDelete(stopId);
    } else {
      // we are removing a draft stop
      await onRemoveDraftStop();
    }
  };

  const onStopDragEnd = async (event: CallbackEvent) => {
    const stopId = editedStopData.scheduled_stop_point_id;
    if (stopId) {
      // if this is a stop existing on the backend, also prepare the changes to be confirmed
      const patch: ScheduledStopPointSetInput = {
        measured_location: mapLngLatToGeoJSON(event.lngLat),
      };
      try {
        const changes = await prepareEdit({
          stopId,
          patch,
        });
        setEditChanges(changes);
      } catch (err) {
        defaultErrorHandler(err as Error);
      }
    } else {
      // for draft stops, just update the edited stop data
      setEditedStopData({
        ...editedStopData,
        measured_location: mapLngLatToGeoJSON(event.lngLat),
      });
    }

    // remove draggability of the stop that it could be edited
    setIsStopDraggable(false);
  };

  const doCreateStop = async (changes: CreateChanges) => {
    try {
      const variables = mapCreateChangesToVariables(changes);
      await insertStopMutation({ variables });

      showSuccessToast(t('stops.saveSuccess'));
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const doEditStop = async (changes: EditChanges) => {
    try {
      const variables = mapEditChangesToVariables(changes);
      await editStopMutation({ variables });

      showSuccessToast(t('stops.editSuccess'));
      onFinishEditing();
    } catch (err) {
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

  const onStopFormSubmit = async (changes: EditChanges | CreateChanges) => {
    // for editing, it'll need to show a confirmation windows
    if (isEditChanges(changes)) {
      setEditChanges(changes);
      return;
    }

    // for creating, it'll execute the creation immediately
    await doCreateStop(changes);
  };

  return (
    <>
      {/* Creates new <Stop> instance for both existing and draft stops */}
      <Stop
        selected
        longitude={editedStopLocation.longitude}
        latitude={editedStopLocation.latitude}
        onClick={() => onStopClicked()}
        draggable={isStopDraggable}
        onDragEnd={(e) => onStopDragEnd(e)}
      />
      {displayedEditor === StopEditorViews.Popup && (
        <StopPopup
          longitude={editedStopLocation.longitude}
          latitude={editedStopLocation.latitude}
          label={editedStopData.label || ''}
          onEdit={() => {
            setDisplayedEditor(StopEditorViews.Modal);
          }}
          onMove={() => {
            setIsStopDraggable(true);
          }}
          onDelete={() => onRemoveStop(editedStopData.scheduled_stop_point_id)}
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
      {editChanges && editChanges.conflicts?.length && (
        <ConflictResolverModal
          onClose={() => setEditChanges(undefined)}
          conflicts={editChanges.conflicts.map(mapStopToCommonConflictItem)}
        />
      )}
      {editChanges && !editChanges.conflicts?.length && (
        <EditStopConfirmationDialog
          isOpen={!!editChanges}
          onCancel={() => setEditChanges(undefined)}
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
};
