import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const testIds = {
  noSheltersText: 'InfoSpotsSection::noSheltersText',
};

export const InfoSpotsNoShelters: FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-4 flex w-full flex-row items-center gap-1"
      data-testid={testIds.noSheltersText}
    >
      <i className="icon-info text-2xl text-brand" />
      <p>{t('stopDetails.infoSpots.noSheltersInfo')}</p>
    </div>
  );
};
