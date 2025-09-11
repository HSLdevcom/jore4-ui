import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Operation, openSingleErrorModalAction } from '../../../../redux';
import { TimetablePriority } from '../../../../types/enums';
import { showSuccessToast } from '../../../../utils';
import {
  TimetablesApiErrorType,
  extractErrorType,
  extractRawSqlError,
} from '../../../../utils/timetablesApiErrors';
import { TimetableImportStrategy } from '../TimetableImportStrategyForm';
import { useTimetablesImport } from './useTimetablesImport';
import { useLoader } from '../../../common/hooks/useLoader';

export const useConfirmTimetablesImportUIAction = () => {
  const { t } = useTranslation();
  const {
    confirmTimetablesImportByCombining,
    confirmTimetablesImportByReplacing,
  } = useTimetablesImport();
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);
  const dispatch = useDispatch();

  const showConfirmFailedErrorDialog = (error: unknown) => {
    if (!(error instanceof ApolloError)) {
      throw error;
    }

    const translateError = (type: TimetablesApiErrorType) => {
      // Note: there are others, but only adding translations to those that can realistically occur here.
      switch (type) {
        case TimetablesApiErrorType.ConflictingSchedulesError:
          return t('timetablesSubmitFailure.errors.conflictingSchedules');
        case TimetablesApiErrorType.MultipleTargetFramesFoundError:
          return t('timetablesSubmitFailure.errors.multipleTargetFramesFound');
        case TimetablesApiErrorType.SequentialIntegrityError:
          return t('timetablesSubmitFailure.errors.sequentialIntegrityError');
        case TimetablesApiErrorType.StagingVehicleScheduleFrameNotFoundError:
          return t(
            'timetablesSubmitFailure.errors.stagingVehicleScheduleFrameNotFound',
          );
        case TimetablesApiErrorType.TargetVehicleScheduleFrameNotFoundError:
          return t(
            'timetablesSubmitFailure.errors.targetVehicleScheduleFrameNotFound',
          );
        case TimetablesApiErrorType.TransactionSystemError:
          return t('timetablesSubmitFailure.errors.transactionSystemError');
        default:
          return t(`timetablesSubmitFailure.errors.unknown`);
      }
    };

    dispatch(
      openSingleErrorModalAction({
        errorModalTitle: t('timetablesSubmitFailure.modalTitle'),
        errorDetails: {
          details: translateError(extractErrorType(error)),
          additionalDetails: extractRawSqlError(error) ?? '',
        },
      }),
    );
  };

  const onConfirmTimetablesImport = async (
    stagingVehicleScheduleFrameIds: ReadonlyArray<UUID>,
    priority: TimetablePriority,
    importStrategy: TimetableImportStrategy,
  ) => {
    setIsLoading(true);

    try {
      if (importStrategy === 'combine') {
        await confirmTimetablesImportByCombining(
          stagingVehicleScheduleFrameIds,
          priority as unknown as TimetablePriority,
        );
      } else if (importStrategy === 'replace') {
        await confirmTimetablesImportByReplacing(
          stagingVehicleScheduleFrameIds,
          priority as unknown as TimetablePriority,
        );
      }

      showSuccessToast(t('import.importSuccess'));
    } finally {
      setIsLoading(false);
    }
  };

  return { onConfirmTimetablesImport, showConfirmFailedErrorDialog };
};
