import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../redux';
import { showSuccessToast } from '../../../../utils';
import { useLoader } from '../../../common/hooks';
import { StopInfoForEditingOnMap } from '../../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { DeleteChanges, useDeleteStop } from './useDeleteStop';

type DeleteUtilsDeleteActive = {
  readonly deleteChanges: DeleteChanges;
  readonly isDeleting: boolean;
  readonly onDeleteStop: () => Promise<void>;
  readonly onConfirmDelete: () => void;
  readonly onCancelDelete: () => void;
};

type DeleteUtilsDeleteInactive = {
  readonly deleteChanges: null;
  readonly isDeleting: boolean;
  readonly onDeleteStop: () => Promise<void>;
  readonly onConfirmDelete?: never;
  readonly onCancelDelete?: never;
};

type UseDeleteStopUtilsReturn =
  | DeleteUtilsDeleteActive
  | DeleteUtilsDeleteInactive;

export function useDeleteStopUtils(
  stopInfo: StopInfoForEditingOnMap | null,
  onFinishEditing: (netexId: string | null) => void,
): UseDeleteStopUtilsReturn {
  const { t } = useTranslation();

  const [deleteChanges, setDeleteChanges] = useState<DeleteChanges | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
    Operation.CheckBrokenRoutes,
  );
  const { setIsLoading: setIsLoadingDeleteStop } = useLoader(
    Operation.DeleteStop,
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
      stopArea: { netexId },
    },
  }: StopInfoForEditingOnMap) => {
    try {
      const changes = await prepareDelete({
        stopPointId: stopId,
        quayId,
        stopPlaceId: netexId,
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

    setIsDeleting(true);
    setIsLoadingBrokenRoutes(true);
    await onPrepareDelete(stopInfo);
    setIsLoadingBrokenRoutes(false);
    setIsDeleting(false);
  };

  if (!deleteChanges) {
    return { deleteChanges: null, isDeleting, onDeleteStop };
  }

  const onConfirmPreviousDelete = async () => {
    throw new Error('Previous delete is still unconfirmed!');
  };

  const onConfirmDelete = async () => {
    try {
      setIsLoadingDeleteStop(true);
      await removeStop(deleteChanges);
      setDeleteChanges(null);

      showSuccessToast(t('stops.removeSuccess'));
      onFinishEditing(null);
    } catch (err) {
      deleteErrorHandler(err as Error);
    } finally {
      setIsLoadingDeleteStop(false);
    }
  };

  const onCancelDelete = () => setDeleteChanges(null);

  return {
    deleteChanges,
    isDeleting,
    onDeleteStop: onConfirmPreviousDelete,
    onConfirmDelete,
    onCancelDelete,
  };
}
