import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../../../redux';
import { EnrichedStopPlace } from '../../../../../../types';
import { log, showToast } from '../../../../../../utils';
import { getApolloErrorMessage } from '../../../../../../utils/apolloErrors';
import { useLoader } from '../../../../../common/hooks';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import {
  FailedToResolveExistingShelter,
  FailedToResolveNewShelters,
} from '../../../../stops/stop-details/stop-version/errors';
import {
  CopyStopAreaInvalidDateRangeError,
  CopyStopAreaSuccessResult,
  OverlappingMultipleStopAreaVersions,
  StopAreaInsertFailed,
  StopAreaVersionFormState,
  StopPlacesInsertFailed,
  stopAreaVersionSchema,
} from '../../types';
import { CopyStopAreaCutConfirmationModalState } from '../types';
import { useCopyStopArea } from './useCopyStopArea';

function useDefaultValues(
  stopArea: EnrichedStopPlace,
): Omit<StopAreaVersionFormState, 'priority'> {
  return useMemo(() => {
    const validityStart = stopArea.validityEnd
      ? DateTime.fromISO(stopArea.validityEnd).plus({ days: 1 }).startOf('day')
      : DateTime.now().startOf('day');

    return {
      indefinite: stopArea.validityEnd === null,
      validityStart: validityStart?.toISODate() ?? '',
      validityEnd: '',
      versionDescription: '',
      versionName: '',
    };
  }, [stopArea]);
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
    if (error instanceof OverlappingMultipleStopAreaVersions) {
      return t(
        'stopAreaDetails.version.errors.overlappingMultipleStopAreaVersions',
        {
          reason: extractNestedOrTopLevelMessage(error),
        },
      );
    }

    if (error instanceof StopPlacesInsertFailed) {
      return t('stopAreaDetails.version.errors.stopPlacesInsertFailed', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof FailedToResolveNewShelters) {
      return t('stopAreaDetails.version.errors.failedToResolveNewShelters', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof StopAreaInsertFailed) {
      return t('stopAreaDetails.version.errors.stopAreaInsertFailed', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof FailedToResolveExistingShelter) {
      return t(
        'stopAreaDetails.version.errors.failedToResolveExistingShelter',
        {
          reason: extractNestedOrTopLevelMessage(error),
        },
      );
    }

    if (error instanceof CopyStopAreaInvalidDateRangeError) {
      return t(
        'stostopAreaDetailsDetails.version.errors.copyStopAreaInvalidDateRangeError',
        {
          reason: extractNestedOrTopLevelMessage(error),
        },
      );
    }

    return extractMessageFromError(error);
  };

  return (error: unknown) => {
    log.error('Failed to create copy of stop area:', error);
    showToast({
      message: t('stopAreaDetails.version.errors.copy', {
        reason: resolveErrorMessage(error),
      }),
      type: 'danger',
      className: 'whitespace-pre',
    });
  };
}

export const useCopyStopAreaFormUtils = (
  stopArea: EnrichedStopPlace,
  onCopyCreated: (result: CopyStopAreaSuccessResult) => void,
) => {
  const { t } = useTranslation();

  const [cutConfirmationState, setCutConfirmationState] = useState<
    CopyStopAreaCutConfirmationModalState | undefined
  >(undefined);
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const copyStopArea = useCopyStopArea();

  const defaultValues = useDefaultValues(stopArea);

  const methods = useForm<StopAreaVersionFormState>({
    defaultValues,
    resolver: zodResolver(stopAreaVersionSchema),
    mode: 'all',
  });
  useDirtyFormBlockNavigation(methods.formState, 'CopyStopAreaForm');

  const handleError = useErrorHandler();

  const handleSuccess = (result: CopyStopAreaSuccessResult) => {
    showToast({
      message: t('stopAreaDetails.version.copy.success'),
      type: 'success',
      className: 'whitespace-pre',
    });
    onCopyCreated(result);
  };

  const onFormSubmit = async (state: StopAreaVersionFormState) => {
    setIsLoading(true);

    try {
      const copyResponse = await copyStopArea({ state, stopArea });

      // Cut confirmation is required
      if ('cutCurrentVersionEnd' in copyResponse) {
        setCutConfirmationState({
          currentVersion: {
            start: stopArea.validityStart ?? '',
            end: stopArea.validityEnd,
            cutVersionToEnd: copyResponse.cutCurrentVersionEnd,
          },
          newVersion: {
            start: state.validityStart,
            end: state.validityEnd,
          },
        });
      } else {
        handleSuccess(copyResponse);
      }
    } catch (e) {
      handleError(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onCutConfirmationSubmit = async (state: StopAreaVersionFormState) => {
    setIsLoading(true);

    try {
      const copyResponse = await copyStopArea({
        state,
        stopArea,
        cutConfirmed: true,
      });

      if (!('mutationResult' in copyResponse)) {
        // Should not be possible
        throw new Error('Unexpected result after copy operation');
      }

      handleSuccess(copyResponse);
    } catch (e) {
      handleError(e);
    } finally {
      setCutConfirmationState(undefined);
      setIsLoading(false);
    }
  };

  return {
    methods,
    cutConfirmationState,
    cancelCutConfirmation: () => setCutConfirmationState(undefined),
    onFormSubmit,
    onCutConfirmationSubmit,
  };
};
