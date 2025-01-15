import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { StopTypeLabel } from '../../../stops/stop-details/StopTypeLabel';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  description: 'StopAreaTitleRow::description',
  name: 'StopAreaTitleRow::name',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation(); 
  
  return (
    <div className={twMerge('flex items-center', className)}>
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <h2 className="mr-2 font-bold" data-testid={testIds.name}>
        {area.stop_place?.name ?? null}
      </h2>

      <div className="text-xl" data-testid={testIds.description}>
        <StopTypeLabel
          hasType={!!area?.stop_place?.weighting}
          text={t('stopPlaceTypes.interchange')}
        />

        <StopTypeLabel
          hasType={!!area?.stop_place?.submode}
          text={t('stopPlaceTypes.railReplacement')}
        />
      </div>

      <div className="flex-grow" />

      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
}