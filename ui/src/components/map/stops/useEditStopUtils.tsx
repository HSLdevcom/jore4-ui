import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { StopRegistryGeoJsonType } from '../../../generated/graphql';
import {
  EditChanges,
  useDefaultErrorHandler,
  useEditStop,
  useLoader,
  useObservationDateQueryParam,
  usePrepareEdit,
} from '../../../hooks';
import { MapEntityEditorViewState, Operation } from '../../../redux';
import { mapLngLatToGeoJSON, showSuccessToast } from '../../../utils';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { useUpdateStopPriorityFilterIfNeeded } from './useUpdateStopPriorityFilterIfNeeded';

type EditUtilsEditActive = {
  readonly editChanges: EditChanges;
  readonly onStartEditingStop: () => void;
  readonly onMoveStop: (event: MapLayerMouseEvent) => Promise<void>;
  readonly onProcessEditChanges: (changes: EditChanges) => void;
  readonly onConfirmEdit: () => void;
  readonly onCancelEdit: () => void;
};

type EditUtilsEditInactive = {
  readonly editChanges: null;
  readonly onStartEditingStop: () => void;
  readonly onMoveStop: (event: MapLayerMouseEvent) => Promise<void>;
  readonly onProcessEditChanges: (changes: EditChanges) => void;
  readonly onConfirmEdit?: never;
  readonly onCancelEdit?: never;
};

type UseEditStopUtilsReturn = EditUtilsEditActive | EditUtilsEditInactive;

export function useEditStopUtils(
  stopInfo: StopInfoForEditingOnMap | null,
  setDisplayedEditor: (newViewState: MapEntityEditorViewState) => void,
  onFinishEditing: (netextId: string) => void,
): UseEditStopUtilsReturn {
  const { t } = useTranslation();

  const [editChanges, setEditChanges] = useState<EditChanges | null>(null);

  const map = useMap();

  const { updateObservationDateByValidityPeriodIfNeeded } =
    useObservationDateQueryParam();
  const updateStopPriorityFilterIfNeeded =
    useUpdateStopPriorityFilterIfNeeded();

  const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
    Operation.CheckBrokenRoutes,
  );
  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const prepareEdit = usePrepareEdit();
  const editStop = useEditStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  const onStartEditingStop = () => {
    if (!stopInfo) {
      // Should never happen
      throw new Error('Stop Info not loaded in yet! Nothing to edit!');
    }

    map.current?.easeTo({
      center: {
        lon: stopInfo.formState.longitude,
        lat: stopInfo.formState.latitude,
      },
    });

    setDisplayedEditor(MapEntityEditorViewState.EDIT);
  };

  const onMoveStop = async (event: MapLayerMouseEvent) => {
    if (!stopInfo) {
      // Should never happen
      throw new Error('Stop Info not loaded in yet! Nothing to move!');
    }

    const {
      formState: {
        publicCode: { value: label },
        stopId,
        quayId,
        stopArea,
      },
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
    } finally {
      setIsLoadingBrokenRoutes(false);
    }
  };

  const onProcessEditChanges = (changes: EditChanges) => {
    setEditChanges(changes);
  };

  if (!editChanges) {
    return {
      editChanges,
      onStartEditingStop,
      onMoveStop,
      onProcessEditChanges,
    };
  }

  const onConfirmEdit = async () => {
    setIsLoadingSaveStop(true);
    try {
      await editStop(editChanges);
      setEditChanges(null);

      showSuccessToast(t('stops.editSuccess'));

      updateObservationDateByValidityPeriodIfNeeded(editChanges.editedStop);
      updateStopPriorityFilterIfNeeded(editChanges.editedStop.priority);

      onFinishEditing(editChanges.quayId);
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsLoadingSaveStop(false);
    }
  };

  const onCancelEdit = () => {
    setDisplayedEditor(MapEntityEditorViewState.POPUP);
    setEditChanges(null);
  };

  return {
    editChanges,
    onStartEditingStop,
    onMoveStop,
    onProcessEditChanges,
    onConfirmEdit,
    onCancelEdit,
  };
}
