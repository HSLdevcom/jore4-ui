import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Operation } from '../../../../../redux';
import { EnrichedStopPlace } from '../../../../../types';
import { log, showDangerToast, showSuccessToast } from '../../../../../utils';
import { getApolloErrorMessage } from '../../../../../utils/apolloErrors';
import { useLoader } from '../../../../common/hooks';
import { useDirtyFormBlockNavigation } from '../../../../forms/common/NavigationBlocker';
import { CopyStopAreaResult } from '../types';
import {
  StopAreaVersionFormState,
  stopAreaVersionSchema,
} from '../types/StopAreaVersionSchema';
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

function useErrorHandler() {
  const { t } = useTranslation();

  const resolveErrorMessage = (error: unknown) => {
    /*
    if (error instanceof FailedToResolveExistingQuays) {
      return t('stopDetails.version.errors.failedToResolveExistingQuays', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }
    */

    return extractMessageFromError(error);
  };

  return (error: unknown) => {
    log.error('Failed to create copy of stop area:', error);
    showDangerToast(
      t('stopDetails.version.errors.copy', {
        reason: resolveErrorMessage(error),
      }),
    );
  };
}

export const useCopyStopAreaFormUtils = (
  stopArea: EnrichedStopPlace,
  onCopyCreated: (result: CopyStopAreaResult) => void,
) => {
  const { t } = useTranslation();

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

  const handleSuccess = (result: CopyStopAreaResult) => {
    showSuccessToast(t('stopDetails.version.success.copy'));
    onCopyCreated(result);
  };

  const onFormSubmit = (state: StopAreaVersionFormState) => {
    setIsLoading(true);
    copyStopArea({ state, stopArea }).then(handleSuccess).catch(handleError);
    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
  };
};
