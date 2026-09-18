import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Operation, useLoader } from '../../../../../redux';
import { showSuccessToast } from '../../../../../utils';
import { MapDepotStop } from '../../../Types';
import { useDefaultErrorHandler } from '../../utils';
import {
  DeleteDepotStopChanges,
  useDeleteDepotStop,
  usePrepareDeleteDepotStop,
} from './useDeleteDepotStop';

type DeleteDepotStopUtilsDeleteActive = {
  readonly deleteChanges: DeleteDepotStopChanges;
  readonly isDeleting: boolean;
  readonly onDeleteDepotStop: () => Promise<void>;
  readonly onConfirmDelete: () => Promise<void>;
  readonly onCancelDelete: () => void;
};

type DeleteDepotStopUtilsDeleteInactive = {
  readonly deleteChanges: null;
  readonly isDeleting: boolean;
  readonly onDeleteDepotStop: () => Promise<void>;
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
  const prepareDeleteDepotStop = usePrepareDeleteDepotStop();
  const deleteDepotStop = useDeleteDepotStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  const { setIsLoading: setIsLoadingBrokenRoutes } = useLoader(
    Operation.CheckBrokenRoutes,
  );
  const { setIsLoading: setIsLoadingDeleteStop } = useLoader(
    Operation.DeleteStop,
  );

  const [deleteChanges, setDeleteChanges] =
    useState<DeleteDepotStopChanges | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteDepotStop = async () => {
    if (!depotStop) {
      return;
    }

    setIsLoadingBrokenRoutes(true);
    try {
      const changes = await prepareDeleteDepotStop(depotStop);
      setDeleteChanges(changes);
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsLoadingBrokenRoutes(false);
    }
  };

  if (!deleteChanges) {
    return { deleteChanges: null, isDeleting, onDeleteDepotStop };
  }

  const onCancelDelete = () => setDeleteChanges(null);

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    setIsLoadingDeleteStop(true);
    try {
      await deleteDepotStop(deleteChanges.depotStop.id);
      showSuccessToast(t(($) => $.stops.removeSuccess));
      setDeleteChanges(null);
      onFinishDeleting();
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsDeleting(false);
      setIsLoadingDeleteStop(false);
    }
  };

  return {
    deleteChanges,
    isDeleting,
    onDeleteDepotStop,
    onConfirmDelete,
    onCancelDelete,
  };
}
