import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdInfoOutline } from 'react-icons/md';

export const StopAreaMemberNoStops: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex w-full flex-row items-center gap-2">
      <MdInfoOutline className="text-2xl text-brand" aria-hidden />
      <p>{t('stopArea.noStops')}</p>
    </div>
  );
};
