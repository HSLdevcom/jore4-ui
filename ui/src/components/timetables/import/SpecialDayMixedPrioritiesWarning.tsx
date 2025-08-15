import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';

export const SpecialDayMixedPrioritiesWarning: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative mt-8 flex flex-row space-x-4 rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-6">
      <MdWarning className="mr-2 inline h-6 w-6 text-hsl-red" role="img" />
      <div className="flex flex-row">
        {t('import.specialDayMixedPrioritiesWarning1')}
        <br />
        {t('import.specialDayMixedPrioritiesWarning2')}
      </div>
    </div>
  );
};
