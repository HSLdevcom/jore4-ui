import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { EditableStopAreaComponentProps } from '../types';
import { StopAreaMemberStopRows } from './StopAreaMemberStopRows';
import { StopAreaMemberStopsHeader } from './StopAreaMemberStopsHeader';

export const StopAreaMemberStops: FC<EditableStopAreaComponentProps> = ({
  area,
  refetch,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center gap-4">
        <h2>{t('stopAreaDetails.memberStops.title')}</h2>

        <StopAreaMemberStopsHeader area={area} refetch={refetch} />
      </div>

      <StopAreaMemberStopRows area={area} />
    </>
  );
};
