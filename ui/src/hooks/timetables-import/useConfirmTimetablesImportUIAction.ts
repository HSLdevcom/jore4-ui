import { ApolloError } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { TimetableImportStrategy } from '../../components/timetables/import/TimetableImportStrategyForm';
import { Operation } from '../../redux';
import { TimetablePriority } from '../../types/enums';
import { showDangerToastWithError, showSuccessToast } from '../../utils';
import {
  TimetablesApiErrorType,
  extractErrorType,
} from '../../utils/timetablesApiErrors';
import { useLoader } from '../ui';
import { useTimetablesImport } from './useTimetablesImport';

export const useConfirmTimetablesImportUIAction = () => {
  const { t } = useTranslation();
  const {
    confirmTimetablesImportByCombining,
    confirmTimetablesImportByReplacing,
  } = useTimetablesImport();
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);

  const showConfirmFailedErrorDialog = (error: unknown) => {
    if (!(error instanceof ApolloError)) {
      throw error;
    }

    const translateException = (type: TimetablesApiErrorType) => {
      // Note: there are others, but only adding translations to those that can realistically occur here.
      switch (type) {
        case 'ConflictingSchedulesError':
          return t('import.errors.conflictingSchedules');
        case 'MultipleTargetFramesFoundError':
          return t('import.errors.multipleTargetFramesFound');
        case 'SequentialIntegrityError':
          return t('import.errors.sequentialIntegrityError');
        case 'StagingVehicleScheduleFrameNotFoundError':
          return t('import.errors.stagingVehicleScheduleFrameNotFound');
        case 'TargetVehicleScheduleFrameNotFoundError':
          return t('import.errors.targetVehicleScheduleFrameNotFound');
        case 'TransactionSystemError':
          return t('import.errors.transactionSystemError');
        default:
          return t(`import.errors.unknown`);
      }
    };

    showDangerToastWithError(
      translateException(extractErrorType(error)),
      error,
    );
  };

  const onConfirmTimetablesImport = async (
    stagingVehicleScheduleFrameIds: UUID[],
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
