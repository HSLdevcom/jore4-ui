import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Operation } from '../../../../redux';
import { showSuccessToast } from '../../../../utils';
import { CreateChanges, useCreateStop } from './useCreateStop';
import { useDefaultErrorHandler } from './useEditStop';
import { useUpdateStopPriorityFilterIfNeeded } from './useUpdateStopPriorityFilterIfNeeded';
import { useLoader } from '../../../common/hooks/useLoader';

export function useCreateStopUtils(
  onFinishEditing: (netextId: string) => void,
) {
  const { t } = useTranslation();

  const [createChanges, setCreateChanges] = useState<CreateChanges | null>(
    null,
  );

  const { setIsLoading: setIsLoadingSaveStop } = useLoader(Operation.SaveStop);

  const { updateObservationDateByValidityPeriodIfNeeded } =
    useObservationDateQueryParam();
  const updateStopPriorityFilterIfNeeded =
    useUpdateStopPriorityFilterIfNeeded();

  const createStop = useCreateStop();
  const defaultErrorHandler = useDefaultErrorHandler();

  /**
   * Inserts scheduled_stop_point, then inserts stopPlace to tiamat
   * Then updates the scheduled_stop_point's stop_place_ref
   * Note: this might all change if we get a transaction service, but for now
   * this is the way to go.
   */
  const doCreateStop = async (changes: CreateChanges) => {
    setIsLoadingSaveStop(true);
    try {
      const { quayId } = await createStop(changes);
      setCreateChanges(null);

      showSuccessToast(t('stops.saveSuccess'));
      updateObservationDateByValidityPeriodIfNeeded(changes.stopPoint);
      updateStopPriorityFilterIfNeeded(changes.stopPoint.priority);
      onFinishEditing(quayId);
    } catch (err) {
      defaultErrorHandler(err as Error);
    } finally {
      setIsLoadingSaveStop(false);
    }
  };

  const onCreateStop = async (changes: CreateChanges) => {
    // If conflict, expose them downstream for conflicts modal.
    // Ultimately followed by a call to onCancelCreate
    if (changes.conflicts?.length) {
      setCreateChanges(changes);
    } else {
      await doCreateStop(changes);
    }
  };

  const onCancelCreate = () => setCreateChanges(null);

  return { createChanges, onCreateStop, onCancelCreate };
}
