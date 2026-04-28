import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MoveQuayToStopAreaHeader } from '../MoveQuayToStopArea';
import { StopAreaComponentProps } from '../types';
import { StopAreaMemberStopRows } from './StopAreaMemberStopRows';

export const StopAreaMemberStops: FC<StopAreaComponentProps> = ({
  className,
  area,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <h2>{t(($) => $.stopAreaDetails.memberStops.title)}</h2>

        <MoveQuayToStopAreaHeader area={area} />
      </div>
      <StopAreaMemberStopRows area={area} />
    </div>
  );
};
