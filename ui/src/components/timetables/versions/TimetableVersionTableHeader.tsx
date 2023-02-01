import { useTranslation } from 'react-i18next';

export const TimetableVersionsTableHeader = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <thead className="text-center [&>th]:p-4">
      <tr>
        <th>{t('timetableVersionsTableHeaders.status')}</th>
        <th>{t('timetableVersionsTableHeaders.dayType')}</th>
        <th>{t('timetableVersionsTableHeaders.validityStart')}</th>
        <th>{t('timetableVersionsTableHeaders.validityEnd')}</th>
        <th>{t('timetableVersionsTableHeaders.label')}</th>
        <th>{t('timetableVersionsTableHeaders.version')}</th>
        <th>{t('timetableVersionsTableHeaders.modified')}</th>
        <th>{t('timetableVersionsTableHeaders.modifier')}</th>
      </tr>
    </thead>
  );
};
