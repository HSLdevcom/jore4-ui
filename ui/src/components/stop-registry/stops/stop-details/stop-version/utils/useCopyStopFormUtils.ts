import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../../../redux';
import { StopWithDetails } from '../../../../../../types';
import { log, showToast } from '../../../../../../utils';
import { getApolloErrorMessage } from '../../../../../../utils/apolloErrors';
import { useLoader } from '../../../../../common/hooks/useLoader';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import {
  FailedToResolveExistingQuays,
  StopPlaceInsertFailed,
  StopPlaceRevertFailed,
  StopPointInsertFailed,
} from '../errors';
import {
  CreateStopVersionResult,
  StopVersionFormState,
  stopVersionSchema,
} from '../types';
import { mapCreateCopyFormStateToInputs } from './mapFormStateToCopyStopInputs';
import { useCopyStop } from './useCopyStop';

function useDefaultValues(
  originalStop: StopWithDetails,
): Omit<StopVersionFormState, 'priority'> {
  return useMemo(() => {
    const validityStart = originalStop.validity_end
      ?.plus({ days: 1 })
      .startOf('day');

    return {
      indefinite: originalStop.validity_end === null,
      validityStart: validityStart?.toISODate() ?? '',
      validityEnd: '',
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

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof FailedToResolveExistingQuays) {
      return t('stopDetails.version.errors.failedToResolveExistingQuays', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof StopPlaceInsertFailed) {
      return t('stopDetails.version.errors.stopPlaceInsertFailed', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof StopPointInsertFailed) {
      return t(
        'stopDetails.version.errors.stopPointInsertFailedStopPlaceReverted',
        { reason: extractNestedOrTopLevelMessage(error) },
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
    mode: 'all',
  });
  useDirtyFormBlockNavigation(methods.formState, 'CopyStopForm');

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

    const { quayInput, stopPointInput, infoSpotInputs, originalStopPlaceId } =
      mapCreateCopyFormStateToInputs(state, originalStop);

    copyStop({ quayInput, stopPointInput, infoSpotInputs, originalStopPlaceId })
      .then(handleSuccess)
      .catch(handleError);

    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
