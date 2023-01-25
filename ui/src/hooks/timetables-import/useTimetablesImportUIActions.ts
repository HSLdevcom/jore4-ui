import { useTranslation } from 'react-i18next';
import { Operation } from '../../redux';
import { Priority, TimetablePriority } from '../../types/enums';
import { showSuccessToast } from '../../utils';
import { useLoader } from '../ui';
import { useConfirmTimetablesImport } from './useConfirmTimetablesImport';

export const useTimetablesImportUIActions = () => {
  const { t } = useTranslation();
  const { confirmTimetablesImport } = useConfirmTimetablesImport();
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);

  const onTimetablesImportConfirm = async (priority: Priority) => {
    setIsLoading(true);

    try {
      await confirmTimetablesImport(priority as unknown as TimetablePriority);
      showSuccessToast(t('timetables.importSuccess'));
    } finally {
      setIsLoading(false);
    }
  };

  return { onTimetablesImportConfirm };
};
