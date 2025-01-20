import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useLoader } from '../../../../../../hooks';
import { Operation } from '../../../../../../redux';
import { log, showToast } from '../../../../../../utils';
import { getApolloErrorMessage } from '../../../../../../utils/apolloErrors';
import {
  StopPlaceInsertFailed,
  StopPlaceRevertFailed,
  StopPointInsertFailed,
} from '../errors';
import {
  CreateStopVersionResult,
  StopVersionFormState,
  stopVersionSchema,
} from '../types';
import { useCopyStop } from './useCopyStop';

function useDefaultValues(originalStop: StopWithDetails): StopVersionFormState {
  return useMemo(() => {
    const validityStart = originalStop.validity_end
      ?.plus({ days: 1 })
      .startOf('day');

    return {
      indefinite: originalStop.validity_end === null,
      validityStart: validityStart?.toISODate() ?? '',
      validityEnd: '',
      priority: originalStop.priority,
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

function useErrorHandler() {
  const { t } = useTranslation();

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof StopPlaceInsertFailed) {
      return t('stopDetails.version.errors.stopPlaceInsertFailed', {
        reason: extractMessageFromError(error.cause),
      });
    }

    if (error instanceof StopPointInsertFailed) {
      return t(
        'stopDetails.version.errors.stopPointInsertFailedStopPlaceReverted',
        { reason: extractMessageFromError(error.cause) },
      );
    }

    if (error instanceof StopPlaceRevertFailed) {
      return t(
        'stopDetails.version.errors.stopPointInsertFailedStopPlaceNotReverted',
        { reason: error.errors.map(extractMessageFromError).join('\n') },
      );
    }

    return extractMessageFromError(error);
  };

  return (error: unknown) => {
    log.error('Failed to create copy of stop place:', error);
    showToast({
      className: 'whitespace-pre-line',
      message: t('stopDetails.version.errors.copy', {
        reason: resolveErrorMessage(error),
      }),
      type: 'danger',
    });
  };
}

export const useCopyStopFormUtils = (
  originalStop: StopWithDetails,
  onCopyCreated: (result: CreateStopVersionResult) => void,
) => {
  const { t } = useTranslation();

  const { setIsLoading } = useLoader(Operation.SaveStop);
  const copyStop = useCopyStop();

  const defaultValues = useDefaultValues(originalStop);

  const methods = useForm<StopVersionFormState>({
    defaultValues,
    resolver: zodResolver(stopVersionSchema),
  });

  const handleError = useErrorHandler();

  const handleSuccess = (result: CreateStopVersionResult) => {
    showToast({
      className: 'whitespace-pre-line',
      message: t('stopDetails.version.success.copy'),
      type: 'success',
    });
    onCopyCreated(result);
  };

  const onFormSubmit = (state: StopVersionFormState) => {
    setIsLoading(true);
    copyStop(state, originalStop).then(handleSuccess).catch(handleError);
    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
