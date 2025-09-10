import { ApolloError } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../../../../hooks';
import {
  Operation,
  closeCutStopVersionValidityModalAction,
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
import { OverlappingCutDatesResult } from '../types/OverLappingCutDatesResult';
import { useEditStopValidityAndPriority } from './useEditStopValidityAndPriority';
import { useGetOverlappingCutDates } from './useGetOverlappingCutDates';
import { useGetOverlappingStopVersions } from './useGetOverlappingStopVersions';
import { useLoader } from '../../../../../common/hooks/useLoader';

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

export const useEditStopFormUtils = (
  originalStop: StopWithDetails,
  onEditDone: (result: EditStopVersionResult) => void,
) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoader(Operation.SaveStop);
  const editStopValidityAndPriority = useEditStopValidityAndPriority();
  const getOverlappingStopVersions = useGetOverlappingStopVersions();
  const cutOverlappingStopVersion = useGetOverlappingCutDates();

  const defaultValues = useDefaultValues(originalStop);

  const methods = useForm<StopVersionFormState>({
    defaultValues,
    resolver: zodResolver(stopVersionSchema),
    mode: 'all',
  });
  useDirtyFormBlockNavigation(methods.formState, 'EditStopForm');

  const handleError = useErrorHandler();

  const handleSuccess = (result: EditStopVersionResult) => {
    showToast({
      className: 'whitespace-pre-line',
      message: t('stopDetails.version.success.edit'),
      type: 'success',
    });
    onEditDone(result);
  };

  const openDialogForNextOverlap = async (
    state: StopVersionFormState,
    overlap: OverlappingCutDatesResult,
  ) => {
    const formatDate = (date?: DateTime) => date?.toFormat('dd.MM.yyyy');

    try {
      if (overlap) {
        const currentVersion = overlap.currentVersion.indefinite
          ? `${formatDate(overlap.currentVersion.start)} -`
          : `${formatDate(overlap.currentVersion.start)} - ${formatDate(overlap.currentVersion.end)}`;
        const newVersion = state.indefinite
          ? `${formatDate(DateTime.fromISO(state.validityStart))} -`
          : `${formatDate(DateTime.fromISO(state.validityStart))} - ${formatDate(DateTime.fromISO(state.validityEnd ?? ''))}`;

        dispatch(
          openCutStopVersionValidityModalAction({
            currentVersion,
            newVersion,
            cutDate: overlap.newVersion?.cutToEnd
              ? (formatDate(overlap.newVersion?.end) ?? '')
              : (formatDate(overlap.newVersion?.start) ?? ''),
            isCutToEnd: overlap.newVersion?.cutToEnd ?? false,
          }),
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  const onFormSubmit = async (state: StopVersionFormState) => {
    setIsLoading(true);

    const { overlappingStopVersions } = await getOverlappingStopVersions(
      originalStop.label,
      originalStop.stop_place_ref ?? '',
      state.priority,
      state.validityStart,
      state.validityEnd,
      state.indefinite,
    );

    if (overlappingStopVersions.length > 0) {
      try {
        // Go through all the overlaps and check that there are no errors
        const cutDates = overlappingStopVersions.map((version) =>
          cutOverlappingStopVersion(state, version),
        );

        await openDialogForNextOverlap(state, cutDates[0]);
      } catch (error) {
        handleError(error);
      }

      setIsLoading(false);
    } else {
      // Add reason for change here when implemented
      editStopValidityAndPriority(
        originalStop.stop_place_ref,
        state.priority,
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

  const onCutConfirmationSubmit = async (state: StopVersionFormState) => {
    setIsLoading(true);

    const { overlappingStopVersions } = await getOverlappingStopVersions(
      originalStop.label,
      originalStop.stop_place_ref ?? '',
      state.priority,
      state.validityStart,
      state.validityEnd,
      state.indefinite,
    );

    if (overlappingStopVersions.length >= 1) {
      try {
        const versionToCut = overlappingStopVersions[0];
        let cutDates = cutOverlappingStopVersion(state, versionToCut);

        if (cutDates.newVersion) {
          // Add reason for change here when implemented
          await editStopValidityAndPriority(
            versionToCut.stop_place_ref,
            versionToCut.priority,
            state.versionName,
            cutDates.newVersion.start.toISODate(),
            cutDates.newVersion.end?.toISODate(),
            cutDates.newVersion.indefinite,
          );
        }

        // There are more overlaps, open the same dialog for the next overlap
        if (overlappingStopVersions.length > 1) {
          const nextVersionToRemove = overlappingStopVersions[1];
          cutDates = cutOverlappingStopVersion(state, nextVersionToRemove);

          await openDialogForNextOverlap(state, cutDates);
          return;
        }
      } catch (error) {
        handleError(error);
        dispatch(closeCutStopVersionValidityModalAction());
        setIsLoading(false);
        return;
      }
    }

    // If there is no overlap remaining, just edit the stop validity
    // Add reason for change here when implemented
    await editStopValidityAndPriority(
      originalStop.stop_place_ref,
      state.priority,
      state.versionName,
      state.validityStart,
      state.validityEnd,
      state.indefinite,
    )
      .then(handleSuccess)
      .catch(handleError);

    dispatch(closeCutStopVersionValidityModalAction());
    setIsLoading(false);
  };

  return {
    methods,
    onFormSubmit,
    onCutConfirmationSubmit,
  };
};
