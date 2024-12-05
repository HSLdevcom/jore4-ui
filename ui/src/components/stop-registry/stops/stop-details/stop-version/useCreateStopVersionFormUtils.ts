import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useLoader } from '../../../../../hooks';
import { Operation } from '../../../../../redux';
import {
  showDangerToast,
  showSuccessToast,
  submitFormByRef,
} from '../../../../../utils';
import {
  CreateStopVersionFormErrors,
  CreateStopVersionFormState,
  createStopVersionSchema,
} from './createStopVersionCommon';
import { useCreateStopVersion } from './useCreateStopVersion';

export const useCreateStopVersionFormUtils = (
  originalStop: StopWithDetails,
  closeModal: () => void,
  formRef: React.MutableRefObject<ExplicitAny>,
) => {
  const { createNewVersion } = useCreateStopVersion();
  // TODO: Loading?
  const { setIsLoading } = useLoader(Operation.SaveStop);

  const defaultValues = { indefinite: false };
  const { t } = useTranslation();

  const methods = useForm<CreateStopVersionFormState>({
    defaultValues,
    resolver: zodResolver(createStopVersionSchema),
  });

  const handleError = (err: Error) => {
    console.log(err)
    showDangerToast(`${t('stops.version.errors.default')}: ${err.message}`); // TODO: Error messages
  };

  const handleSuccess = () => {
    closeModal();
    showSuccessToast(t('stops.version.saved')); // TODO: Check message translation
  };

  const onFormSubmit = (state: CreateStopVersionFormState) => {
    setIsLoading(true);
    createNewVersion(state, originalStop)
      .catch(handleError)
      .then(handleSuccess);
    setIsLoading(false);
  };

  // TODO : Remove or show toast
  const onFormValidationError = (errors: CreateStopVersionFormErrors) => {
    console.debug('Form validation error', errors);
  };

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return {
    methods,
    onSave,
    onFormSubmit,
    onFormValidationError,
  };
};
