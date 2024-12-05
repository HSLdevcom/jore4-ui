import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useLoader } from '../../../../../hooks';
import { Operation } from '../../../../../redux';
import { log, showDangerToast, showSuccessToast } from '../../../../../utils';
import {
  StopVersionFormState,
  stopVersionSchema,
} from './StopVersionFormState';
import { useCreateStopVersion } from './useCreateStopVersion';

export const useCreateStopVersionFormUtils = (
  originalStop: StopWithDetails,
  closeModal: () => void,
) => {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.SaveStop);
  const { createNewVersion } = useCreateStopVersion();

  const defaultValues: StopVersionFormState = useMemo(
    () => ({
      indefinite: originalStop.validity_end === null,
      validityStart: originalStop.validity_start?.toISODate() ?? '',
      validityEnd: originalStop.validity_end?.toISODate(),
      priority: originalStop.priority,
      versionDescription: '',
      versionName: '',
    }),
    [originalStop],
  );

  const methods = useForm<StopVersionFormState>({
    defaultValues,
    resolver: zodResolver(stopVersionSchema),
  });

  const handleError = (err: Error) => {
    log.error(err);
    showDangerToast(
      `${t('stopDetails.version.errors.default')}: ${err.message}`,
    );
  };

  const handleSuccess = () => {
    closeModal();
    showSuccessToast(t('stopDetails.version.success.copy'));
  };

  const onFormSubmit = (state: StopVersionFormState) => {
    setIsLoading(true);
    createNewVersion(state, originalStop)
      .catch(handleError)
      .then(handleSuccess);
    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
