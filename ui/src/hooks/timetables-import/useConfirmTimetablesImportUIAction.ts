import { useTranslation } from 'react-i18next';
import { TimetableImportStrategy } from '../../components/timetables/import/TimetableImportStrategyForm';
import { Operation } from '../../redux';
import { Priority, TimetablePriority } from '../../types/enums';
import { showSuccessToast } from '../../utils';
import { useLoader } from '../ui';
import { useTimetablesImport } from './useTimetablesImport';

export const useConfirmTimetablesImportUIAction = () => {
  const { t } = useTranslation();
  const {
    confirmTimetablesImportByCombining,
    confirmTimetablesImportByReplacing,
  } = useTimetablesImport();
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);

  const onConfirmTimetablesImport = async (
    priority: Priority,
    importStrategy: TimetableImportStrategy,
  ) => {
    setIsLoading(true);

    try {
      if (importStrategy === 'combine') {
        await confirmTimetablesImportByCombining(
          priority as unknown as TimetablePriority,
        );
      } else if (importStrategy === 'replace') {
        await confirmTimetablesImportByReplacing(
          priority as unknown as TimetablePriority,
        );
      }

      showSuccessToast(t('import.importSuccess'));
    } finally {
      setIsLoading(false);
    }
  };

  return { onConfirmTimetablesImport };
};
