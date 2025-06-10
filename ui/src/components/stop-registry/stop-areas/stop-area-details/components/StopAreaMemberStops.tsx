import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EditableStopAreaComponentProps } from '../types';
import { StopAreaMemberStopRows } from './StopAreaMemberStopRows';
import { StopAreaMemberStopsHeader } from './StopAreaMemberStopsHeader';

export const StopAreaMemberStops: FC<EditableStopAreaComponentProps> = ({
  area,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-4">
        <h2>{t('stopAreaDetails.memberStops.title')}</h2>

        {area.id && <StopAreaMemberStopsHeader areaId={area.id} />}
      </div>

      <StopAreaMemberStopRows area={area} />
    </>
  );
};
