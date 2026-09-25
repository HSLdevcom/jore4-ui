import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { Operation, useLoader } from '../../../../../redux';
import { showSuccessToast } from '../../../../../utils';
import { MapDepotStop } from '../../../Types';
import { useDefaultErrorHandler } from '../../utils';
import { DepotStopFormState } from '../DepotStopFormSchema';
import { useEditDepotStop } from '../useEditDepotStop';

type NewDepotStopLocation = {
  readonly latitude: number;
  readonly longitude: number;
};

export type MoveDepotStopChanges = {
  readonly depotStop: MapDepotStop;
  readonly newLocation: NewDepotStopLocation;
};

type MoveDepotStopUtilsMoveActive = {
  readonly moveChanges: MoveDepotStopChanges;
  readonly isMoving: boolean;
  readonly onMoveDepotStop: (event: MapLayerMouseEvent) => void;
  readonly onConfirmMove: () => Promise<void>;
  readonly onCancelMove: () => void;
};

type MoveDepotStopUtilsMoveInactive = {
  readonly moveChanges: null;
  readonly isMoving: boolean;
  readonly onMoveDepotStop: (event: MapLayerMouseEvent) => void;
  readonly onConfirmMove?: never;
  readonly onCancelMove?: never;
};

type UseMoveDepotStopUtilsReturn =
  MoveDepotStopUtilsMoveActive | MoveDepotStopUtilsMoveInactive;

export function useMoveDepotStopUtils(
  depotStop: MapDepotStop | undefined,
  onMoveFinished: () => void,
): UseMoveDepotStopUtilsReturn {
  const { t } = useTranslation();
  const map = useMap();
  const editDepotStop = useEditDepotStop();
  const defaultErrorHandler = useDefaultErrorHandler();
  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const [moveChanges, setMoveChanges] = useState<MoveDepotStopChanges | null>(
    null,
  );
  const [isMoving, setIsMoving] = useState(false);

  const onMoveDepotStop = (event: MapLayerMouseEvent) => {
    if (!depotStop) {
      throw new Error('Depot stop not loaded in yet! Nothing to move!');
    }

    const [longitude, latitude] = event.lngLat.toArray();
    setMoveChanges({ depotStop, newLocation: { latitude, longitude } });
  };

  if (!moveChanges) {
    return { moveChanges: null, isMoving, onMoveDepotStop };
  }

  const onCancelMove = () => {
    setMoveChanges(null);
    onMoveFinished();
  };

  const onConfirmMove = async () => {
    const { depotStop: movedDepotStop, newLocation } = moveChanges;
    const state: DepotStopFormState = {
      label: movedDepotStop.label,
      ...newLocation,
    };

    setIsMoving(true);
    setIsLoadingSaveStop(true);
    try {
      await editDepotStop(movedDepotStop.id, state);
      setMoveChanges(null);
      showSuccessToast(t(($) => $.stops.editSuccess));

      map.current?.easeTo({
        center: { lon: newLocation.longitude, lat: newLocation.latitude },
      });

      onMoveFinished();
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsMoving(false);
      setIsLoadingSaveStop(false);
    }
  };

  return {
    moveChanges,
    isMoving,
    onMoveDepotStop,
    onConfirmMove,
    onCancelMove,
  };
}
