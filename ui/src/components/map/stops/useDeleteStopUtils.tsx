import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteChanges, useDeleteStop, useLoader } from '../../../hooks';
import { Operation } from '../../../redux';
import { showSuccessToast } from '../../../utils';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';

type DeleteUtilsDeleteActive = {
  readonly deleteChanges: DeleteChanges;
  readonly onDeleteStop: () => Promise<void>;
  readonly onConfirmDelete: () => void;
  readonly onCancelDelete: () => void;
};

type DeleteUtilsDeleteInactive = {
  readonly deleteChanges: null;
  readonly onDeleteStop: () => Promise<void>;
  readonly onConfirmDelete?: never;
  readonly onCancelDelete?: never;
};

type UseDeleteStopUtilsReturn =
  | DeleteUtilsDeleteActive
  | DeleteUtilsDeleteInactive;

export function useDeleteStopUtils(
  stopInfo: StopInfoForEditingOnMap | null,
  onFinishEditing: () => void,
): UseDeleteStopUtilsReturn {
  const { t } = useTranslation();

  const [deleteChanges, setDeleteChanges] = useState<DeleteChanges | null>(
    null,
  );

  const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
    Operation.CheckBrokenRoutes,
  );

  const {
    prepareDelete,
    removeStop,
    defaultErrorHandler: deleteErrorHandler,
  } = useDeleteStop();

  const onPrepareDelete = async ({
    formState: {
      stopId,
      quayId,
      stopArea: { netextId },
    },
  }: StopInfoForEditingOnMap) => {
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

  const onDeleteStop = async () => {
    if (!stopInfo) {
      throw new Error('Stop Info not loaded in yet! Nothing to delete!');
    }

    setIsLoadingBrokenRoutes(true);
    await onPrepareDelete(stopInfo);
    setIsLoadingBrokenRoutes(false);
  };

  if (!deleteChanges) {
    return { deleteChanges: null, onDeleteStop };
  }

  const onConfirmPreviousDelete = async () => {
    throw new Error('Previous delete is still unconfirmed!');
  };

  const onConfirmDelete = async () => {
    try {
      await removeStop(deleteChanges);

      showSuccessToast(t('stops.removeSuccess'));
      onFinishEditing();
    } catch (err) {
      deleteErrorHandler(err as Error);
    }
  };

  const onCancelDelete = () => setDeleteChanges(null);

  return {
    deleteChanges,
    onDeleteStop: onConfirmPreviousDelete,
    onConfirmDelete,
    onCancelDelete,
  };
}
