import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { PageTitle } from '../../../../common';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { StopTypeLabel } from '../../../stops/stop-details/StopTypeLabel';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  privateCode: 'StopAreaTitleRow::privateCode',
  name: 'StopAreaTitleRow::name',
  weighting: 'StopAreaTitleRow::weighting',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={twMerge('flex items-center', className)}>
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <PageTitle.H1 className="mr-2" testId={testIds.name}>
        {area.name ?? ''}
      </PageTitle.H1>

      <div className="text-xl" data-testid={testIds.privateCode}>
        {area.privateCode?.value ?? null}
      </div>

      <div className="pl-5" data-testid={testIds.weighting}>
        <StopTypeLabel
          hasType={!!area?.weighting}
          text={t('stopPlaceTypes.interchange')}
        />

        <StopTypeLabel
          hasType={!!area?.submode}
          text={t('stopPlaceTypes.railReplacement')}
        />
      </div>

      <div className="flex-grow" />

      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
};
