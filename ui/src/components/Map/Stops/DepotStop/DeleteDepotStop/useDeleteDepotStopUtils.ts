import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '../../../../../utils';
import { MapDepotStop } from '../../../Types';
import { useDefaultErrorHandler } from '../../utils';
import { useDeleteDepotStop } from './useDeleteDepotStop';

type DeleteDepotStopUtilsDeleteActive = {
  readonly depotStopPendingDelete: MapDepotStop;
  readonly isDeleting: boolean;
  readonly onDeleteDepotStop: () => void;
  readonly onConfirmDelete: () => Promise<void>;
  readonly onCancelDelete: () => void;
};

type DeleteDepotStopUtilsDeleteInactive = {
  readonly depotStopPendingDelete: null;
  readonly isDeleting: boolean;
  readonly onDeleteDepotStop: () => void;
  readonly onConfirmDelete?: never;
  readonly onCancelDelete?: never;
};

type UseDeleteDepotStopUtilsReturn =
  DeleteDepotStopUtilsDeleteActive | DeleteDepotStopUtilsDeleteInactive;

export function useDeleteDepotStopUtils(
  depotStop: MapDepotStop | undefined,
  onFinishDeleting: () => void,
): UseDeleteDepotStopUtilsReturn {
  const { t } = useTranslation();
  const deleteDepotStop = useDeleteDepotStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  const [depotStopPendingDelete, setDepotStopPendingDelete] =
    useState<MapDepotStop | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteDepotStop = () => {
    if (depotStop) {
      setDepotStopPendingDelete(depotStop);
    }
  };

  if (!depotStopPendingDelete) {
    return { depotStopPendingDelete: null, isDeleting, onDeleteDepotStop };
  }

  const onCancelDelete = () => setDepotStopPendingDelete(null);

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDepotStop(depotStopPendingDelete.id);
      showSuccessToast(t(($) => $.stops.removeSuccess));
      setDepotStopPendingDelete(null);
      onFinishDeleting();
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    depotStopPendingDelete,
    isDeleting,
    onDeleteDepotStop,
    onConfirmDelete,
    onCancelDelete,
  };
}
