import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { StopWithDetails, useLoader } from '../../../../../hooks';
import { Operation } from '../../../../../redux';
import { submitFormByRef } from '../../../../../utils';
import {
  CreateStopVersionFormState,
  createStopVersionSchema,
} from './createStopVersionCommon';
import { useCreateStopVersion } from './useCreateStopVersion';

export const useCreateStopVersionFormUtils = (
  originalStop: StopWithDetails,
  onSaved: () => void,
  formRef: React.MutableRefObject<ExplicitAny>,
) => {
  const { createNewVersion } = useCreateStopVersion();
  // TODO: Loading?
  const { setIsLoading } = useLoader(Operation.SaveStop);

  const defaultValues = {};

  const methods = useForm<CreateStopVersionFormState>({
    defaultValues,
    resolver: zodResolver(createStopVersionSchema),
  });

  const { handleSubmit } = methods;

  const handleError = (err: Error) => {
    // TODO: handle submit error
    console.log(err);
  };

  const onFormSubmit = async (state: CreateStopVersionFormState) => {
    setIsLoading(true);

    if (!originalStop) {
      return;
    }

    try {
      await createNewVersion(state, originalStop);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = () => {
    submitFormByRef(formRef);
  };

  return {
    methods,
    handleSubmit,
    onSave,
    onFormSubmit,
  };
};
