import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { StopRegistryGeoJsonType } from '../../../generated/graphql';
import {
  CreateChanges,
  DeleteChanges,
  EditChanges,
  isEditChanges,
  useAppAction,
  useAppSelector,
  useCreateStop,
  useDefaultErrorHandler,
  useDeleteStop,
  useEditStop,
  useLoader,
  useMapDataLayerLoader,
  useObservationDateQueryParam,
  usePrepareEdit,
} from '../../../hooks';
import {
  EditedMapStopData,
  Operation,
  closeTimingPlaceModalAction,
  selectIsMoveStopModeEnabled,
  setEditedStopDataAction,
  setIsMoveStopModeEnabledAction,
  setSelectedRouteIdAction,
  setSelectedStopIdAction,
} from '../../../redux';
import { mapLngLatToGeoJSON, showSuccessToast } from '../../../utils';
import {
  StopInfoForEditingOnMap,
  useGetStopInfoForEditingOnMap,
} from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import {
  ConflictResolverModal,
  mapStopToCommonConflictItem,
} from '../../routes-and-lines/common/ConflictResolverModal';
import { EditStoplayerRef } from '../refTypes';
import { DeleteStopConfirmationDialog } from './DeleteStopConfirmationDialog';
import { EditStopConfirmationDialog } from './EditStopConfirmationDialog';
import { EditStopModal } from './EditStopModal';
import { StopPopup } from './StopPopup';
import { useUpdateStopPriorityFilterIfNeeded } from './useUpdateStopPriorityFilterIfNeeded';

enum StopEditorViews {
  None,
  Popup,
  Modal,
}

interface Props {
  editedStopData: EditedMapStopData;
  selectedStopId?: string;
  onEditingFinished?: () => void;
  onPopupClose?: () => void;
}

export const EditStopLayer = forwardRef<EditStoplayerRef, Props>(
  (
    { editedStopData, onEditingFinished, onPopupClose, selectedStopId },
    ref,
  ) => {
    const [createChanges, setCreateChanges] = useState<CreateChanges>();
    const [editChanges, setEditChanges] = useState<EditChanges>();
    const [deleteChanges, setDeleteChanges] = useState<DeleteChanges>();
    const [displayedEditor, setDisplayedEditor] = useState<StopEditorViews>(
      StopEditorViews.None,
    );

    const { stopInfo, loading } = useGetStopInfoForEditingOnMap(selectedStopId);
    useMapDataLayerLoader(
      Operation.FetchStopInfo,
      !!stopInfo || !selectedStopId,
      loading,
    );

    const dispatch = useDispatch();
    const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);

    const { t } = useTranslation();
    const { updateObservationDateByValidityPeriodIfNeeded } =
      useObservationDateQueryParam();
    const updateStopPriorityFilterIfNeeded =
      useUpdateStopPriorityFilterIfNeeded();

    const setSelectedStopId = useAppAction(setSelectedStopIdAction);
    const setEditedStopData = useAppAction(setEditedStopDataAction);
    const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
      Operation.CheckBrokenRoutes,
    );
    const { setIsLoading: setIsLoadingSaveStop } = useLoader(
      Operation.SaveStop,
    );

    const createStop = useCreateStop();

    const editStop = useEditStop();
    const defaultErrorHandler = useDefaultErrorHandler();
    const prepareEdit = usePrepareEdit();
    const {
      prepareDelete,
      removeStop,
      defaultErrorHandler: deleteErrorHandler,
    } = useDeleteStop();

    // computed values for the edited stop
    const isDraftStop = editedStopData.type === 'draft';
    const defaultDisplayedEditor = isDraftStop
      ? StopEditorViews.Modal
      : StopEditorViews.Popup;

    const defaultValues =
      editedStopData.type === 'draft' ? editedStopData : stopInfo?.formState;

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

    const onPrepareDelete = async ({
      formState: {
        stopId,
        quayId,
        stopArea: { netextId },
      },
    }: StopInfoForEditingOnMap) => {
      // we are removing stop that is already stored to backend
      try {
        const changes = await prepareDelete({
          stopPointId: stopId,
          quayId,
          stopPlaceId: netextId,
        });

        setDeleteChanges(changes);
      } catch (err) {
        deleteErrorHandler(err as Error);
      }
    };

    const onRemoveStop = async () => {
      if (stopInfo) {
        setIsLoadingBrokenRoutes(true);
        // we are removing stop that is already stored to backend
        await onPrepareDelete(stopInfo);
        setIsLoadingBrokenRoutes(false);
      } else {
        // we are removing a draft stop
        onFinishEditing();
      }
    };

    const onMoveStop = async (event: MapLayerMouseEvent) => {
      if (editedStopData.type === 'draft') {
        // for draft stops, just update the edited stop data
        setEditedStopData({
          type: 'draft',
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
        });
      } else {
        if (!stopInfo) {
          // Should never happen
          throw new Error("Cannot move stop if it isn't loaded in yet!");
        }

        const {
          formState: { label, stopId, quayId, stopArea },
        } = stopInfo;
        const stopPlaceId = stopArea?.netextId;

        setIsLoadingBrokenRoutes(true);
        try {
          const changes = await prepareEdit({
            stopLabel: label,
            stopId,
            stopPointPatch: {
              measured_location: mapLngLatToGeoJSON(event.lngLat.toArray()),
            },
            stopPlaceId,
            quayId,
            quayPatch: {
              geometry: {
                type: StopRegistryGeoJsonType.Point,
                coordinates: event.lngLat.toArray(),
              },
            },
          });
          setEditChanges(changes);
        } catch (err) {
          defaultErrorHandler(err as Error);
        }
        setIsLoadingBrokenRoutes(false);
      }
    };

    const onEditStop = () => setDisplayedEditor(StopEditorViews.Modal);

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
        await createStop(changes);

        showSuccessToast(t('stops.saveSuccess'));
        updateObservationDateByValidityPeriodIfNeeded(changes.stopPoint);
        updateStopPriorityFilterIfNeeded(changes.stopPoint.priority);
        onFinishEditing();
      } catch (err) {
        defaultErrorHandler(err as Error);
      } finally {
        setIsLoadingSaveStop(false);
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
        defaultErrorHandler(err as Error);
      } finally {
        setIsLoadingSaveStop(false);
      }
    };

    // we are removing stop that is already stored to backend
    const doDeleteStop = async (changes: DeleteChanges) => {
      try {
        await removeStop(changes);

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
        {displayedEditor === StopEditorViews.Popup && stopInfo && (
          <StopPopup
            stop={stopInfo}
            onEdit={onEditStop}
            onMove={onStartMoveStop}
            onDelete={onRemoveStop}
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
