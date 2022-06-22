import { useTranslation } from 'react-i18next';

export const LineDraftTableHeader = ({
  className = '',
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const commonClassName = 'p-4';
  return (
    <thead className={`${className} text-left`}>
      <tr>
        <th className={commonClassName}>{t('priority.label')}</th>
        <th className={commonClassName}>{t('validityStart')}</th>
        <th className={commonClassName}>{t('validityEnd')}</th>
        <th className={commonClassName}>{t('lines.label')}</th>
        <th className={commonClassName}>{t('tableHeaders.name')}</th>
        <th className={commonClassName}>{t('tableHeaders.edited')}</th>
        <th className={commonClassName}>{t('tableHeaders.editor')}</th>
      </tr>
    </thead>
  );
};
