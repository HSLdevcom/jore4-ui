import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../../../../../../hooks';
import { Operation } from '../../../../../../redux';
import { StopWithDetails } from '../../../../../../types';
import { log, showToast } from '../../../../../../utils';
import { getApolloErrorMessage } from '../../../../../../utils/apolloErrors';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { QuayKeyValuesEditFailed } from '../errors/QuayKeyValuesEditFailed';
import { ScheduledStopPointEditFailed } from '../errors/ScheduledStopPointEditFailed';
import { StopVersionFormState, stopVersionSchema } from '../types';
import { EditStopVersionResult } from '../types/EditStopVersionResult';
import { useEditStopValidity } from './useEditStopValidity';
import { useGetOverlappingStopVersions } from './useGetOverlappingStopVersions';

function useDefaultValues(
  originalStop: StopWithDetails,
): Omit<StopVersionFormState, 'priority'> {
  return useMemo(() => {
    const validityStart = originalStop.validity_start?.startOf('day');
    const validityEnd = originalStop.validity_end?.startOf('day');

    return {
      indefinite: originalStop.validity_end === null,
      validityStart: validityStart?.toISODate() ?? '',
      validityEnd: validityEnd?.toISODate() ?? '',
      versionDescription: '',
      versionName: '',
    };
  }, [originalStop]);
}

function extractMessageFromError(error: unknown) {
  if (error instanceof ApolloError) {
    return getApolloErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return JSON.stringify(error, null, 0);
}

function extractNestedOrTopLevelMessage(error: unknown) {
  if (error instanceof Error && error.cause) {
    return extractMessageFromError(error.cause);
  }

  return extractMessageFromError(error);
}

function useErrorHandler() {
  const { t } = useTranslation();

  // TODO: Check these for edit
  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof ScheduledStopPointEditFailed) {
      return t('stopDetails.version.errors.failedToEditScheduledStopPoint', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof QuayKeyValuesEditFailed) {
      return t('stopDetails.version.errors.failedToEditQuayKeyValues', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    return extractMessageFromError(error);
  };

  return (error: unknown) => {
    log.error('Failed to edit stop validity:', error);
    showToast({
      className: 'whitespace-pre-line',
      message: t('stopDetails.version.errors.edit', {
        reason: resolveErrorMessage(error),
      }),
      type: 'danger',
    });
  };
}

export const useEditStopValidityFormUtils = (
  originalStop: StopWithDetails,
  onEditDone: (result: EditStopVersionResult) => void,
) => {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.SaveStop);
  const editStopValidity = useEditStopValidity();
  const getOverlappingStopVersions = useGetOverlappingStopVersions();

  const defaultValues = useDefaultValues(originalStop);

  const methods = useForm<StopVersionFormState>({
    defaultValues,
    resolver: zodResolver(stopVersionSchema),
    mode: 'all',
  });
  useDirtyFormBlockNavigation(methods.formState, 'EditStopValidityForm');

  const handleError = useErrorHandler();

  const handleSuccess = (result: EditStopVersionResult) => {
    showToast({
      className: 'whitespace-pre-line',
      message: t('stopDetails.version.success.edit'),
      type: 'success',
    });
    onEditDone(result);
  };

  const onFormSubmit = async (state: StopVersionFormState) => {
    setIsLoading(true);

    const { overlappingStopVersions } = await getOverlappingStopVersions(
      originalStop.label,
      originalStop.stop_place_ref ?? '',
      originalStop.priority,
      state.validityStart,
      state.validityEnd,
      state.indefinite,
    );

    if (overlappingStopVersions.length > 0) {
      // TODO: Show the conflict modal

      showToast({
        className: 'whitespace-pre-line',
        message: t('stopDetails.version.errors.edit', {
          reason: 'DUPLIKAATTI',
        }),
      });
      setIsLoading(false);
      return;
    }

    editStopValidity(state, originalStop)
      .then(handleSuccess)
      .catch(handleError);
    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
