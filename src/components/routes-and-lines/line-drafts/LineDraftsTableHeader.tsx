import { useTranslation } from 'react-i18next';

export const LineDraftTableHeader = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  const { t } = useTranslation();
  const commonClassName = 'p-4';
  return (
    <tr className={`${className} text-left`}>
      <th className={commonClassName}>{t('status')}</th>
      <th className={commonClassName}>{t('validityStart')}</th>
      <th className={commonClassName}>{t('validityEnd')}</th>
      <th className={commonClassName}>{t('lines.label')}</th>
      <th className={commonClassName}>{t('name')}</th>
      <th className={commonClassName}>{t('edited')}</th>
      <th className={commonClassName}>{t('editor')}</th>
    </tr>
  );
};
