import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useLoader } from '../../../../../../hooks';
import {
  Operation,
  openCutStopVersionValidityModalAction,
} from '../../../../../../redux';
import { StopWithDetails } from '../../../../../../types';
import { log, showToast } from '../../../../../../utils';
import { getApolloErrorMessage } from '../../../../../../utils/apolloErrors';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { FailedToCutOverlappingStopVersion } from '../errors/FailedToCutOverlappingStopVersion';
import { QuayKeyValuesEditFailed } from '../errors/QuayKeyValuesEditFailed';
import { ScheduledStopPointEditFailed } from '../errors/ScheduledStopPointEditFailed';
import { UnableToCutOverlappingStopVersion } from '../errors/UnableToCutOverlappingStopVersion';
import { StopVersionFormState, stopVersionSchema } from '../types';
import { EditStopVersionResult } from '../types/EditStopVersionResult';
import { useCutOverlappingStopVersion } from './useCutOverlappingStopVersion';
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

    if (error instanceof FailedToCutOverlappingStopVersion) {
      return t('stopDetails.version.errors.failedToCutOverlappingStopVersion', {
        reason: extractNestedOrTopLevelMessage(error),
      });
    }

    if (error instanceof UnableToCutOverlappingStopVersion) {
      return t('stopDetails.version.errors.unableToCutOverlappingStopVersion', {
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

  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const editStopValidity = useEditStopValidity();
  const getOverlappingStopVersions = useGetOverlappingStopVersions();
  const cutOverlappingStopVersion = useCutOverlappingStopVersion();

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
      // TODO: Determine the dates to cut the overlapping stop versions to
      // TODO: Determine here if the overlap is such that the new version can be cut
      // If there are some causes, show error toast and don't open the modal
      // Otherwise, generate the description that contains the dates

      dispatch(
        openCutStopVersionValidityModalAction({
          description: t('cutStopVersionValidityModal.description'),
        }),
      );
      setIsLoading(false);
    } else {
      editStopValidity(
        originalStop.stop_place_ref,
        originalStop.priority,
        state.versionName,
        state.validityStart,
        state.validityEnd,
        state.indefinite,
      )
        .then(handleSuccess)
        .catch(handleError);
    }

    setIsLoading(false);
  };

  const onDialogSubmit = async (state: StopVersionFormState) => {
    setIsLoading(true);

    const { overlappingStopVersions } = await getOverlappingStopVersions(
      originalStop.label,
      originalStop.stop_place_ref ?? '',
      originalStop.priority,
      state.validityStart,
      state.validityEnd,
      state.indefinite,
    );

    const overlapCutSuccess = overlappingStopVersions.every(async (version) => {
      try {
        await cutOverlappingStopVersion(state, version);
        return true;
      } catch (error) {
        handleError(error);
        return false;
      }
    });

    if (overlapCutSuccess) {
      // After all cuts, save the new version
      await editStopValidity(
        originalStop.stop_place_ref,
        originalStop.priority,
        state.versionName,
        state.validityStart,
        state.validityEnd,
        state.indefinite,
      )
        .then(handleSuccess)
        .catch(handleError);
    }

    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
    onDialogSubmit,
  };
};
