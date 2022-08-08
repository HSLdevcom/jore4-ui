import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { ScheduledStopPointSetInput, StopWithLocation } from '../../../graphql';
import {
  CreateChanges,
  DeleteChanges,
  EditChanges,
  isEditChanges,
  StopWithVehicleMode,
  useAppAction,
  useCreateStop,
  useDeleteStop,
  useEditStop,
  useLoader,
  useMapStops,
} from '../../../hooks';
import {
  Operation,
  setEditedStopDataAction,
  setSelectedStopIdAction,
} from '../../../redux';
import {
  mapLngLatToGeoJSON,
  mapLngLatToPoint,
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
  onPopupClose?: () => void;
}

export const EditStopLayer: React.FC<Props> = ({
  editedStopData,
  onEditingFinished,
  onPopupClose,
}) => {
  const [isStopDraggable, setIsStopDraggable] = useState(false);
  const [createChanges, setCreateChanges] = useState<CreateChanges>();
  const [editChanges, setEditChanges] = useState<EditChanges>();
  const [deleteChanges, setDeleteChanges] = useState<DeleteChanges>();
  const [displayedEditor, setDisplayedEditor] = useState<StopEditorViews>(
    StopEditorViews.None,
  );

  const { t } = useTranslation();

  const setSelectedStopId = useAppAction(setSelectedStopIdAction);
  const setEditedStopData = useAppAction(setEditedStopDataAction);
  const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
    Operation.CheckBrokenRoutes,
  );
  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

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

  const { getStopVehicleMode } = useMapStops();

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

  const onStopDragEnd = async (event: CallbackEvent) => {
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

    // remove draggability of the stop that it could be edited
    setIsStopDraggable(false);
  };

  const doCreateStop = async (changes: CreateChanges) => {
    setIsLoadingSaveStop(true);
    try {
      const variables = mapCreateChangesToVariables(changes);
      await insertStopMutation(variables);

      showSuccessToast(t('stops.saveSuccess'));
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
      onFinishEditing();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
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

  const getVehicleMode = () =>
    editedStopData.scheduled_stop_point_id
      ? getStopVehicleMode(editedStopData as StopWithVehicleMode)
      : undefined;

  const currentConflicts = getCurrentConflicts();
  return (
    <>
      {/* Creates new <Stop> instance for both existing and draft stops */}
      <Stop
        testId="map:stopMarker:editedStop"
        selected
        longitude={editedStopLocation.longitude}
        latitude={editedStopLocation.latitude}
        onClick={() => onStopClicked()}
        draggable={isStopDraggable}
        onDragEnd={(e) => onStopDragEnd(e)}
        isHighlighted
        onVehicleRoute={getVehicleMode()}
      />
      {displayedEditor === StopEditorViews.Popup && (
        <StopPopup
          stop={editedStopData}
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
