import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const testIds = {
  noStopsText: 'StopAreaDetails::noStopsText',
};

export const StopAreaMemberNoStops: FC = () => {
  const { t } = useTranslation();

  return (
    <div
      className="mt-4 flex w-full flex-row items-center gap-1"
      data-testid={testIds.noStopsText}
    >
      <i className="icon-info text-2xl text-brand" />
      <p>{t('stopArea.noStops')}</p>
    </div>
  );
};
