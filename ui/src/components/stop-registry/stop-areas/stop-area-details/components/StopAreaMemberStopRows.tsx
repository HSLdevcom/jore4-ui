import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { StopAreaComponentProps } from '../types';
import { mapMembersToStopSearchFormat } from '../utils';
import { StopAreaMemberNoStops } from './StopAreaMemberNoStops';
import { StopAreaMemberStopRow } from './StopAreaMemberStopRow';

export const StopAreaMemberStopRows: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const memberStops = mapMembersToStopSearchFormat(area);

  if (memberStops.length === 0) {
    return <StopAreaMemberNoStops />;
  }

  return (
    <table
      className={twMerge(
        'mt-4 h-1 w-full border-x border-x-light-grey',
        className,
      )}
    >
      <tbody>
        {memberStops.map((member) => (
          <StopAreaMemberStopRow
            key={member.scheduled_stop_point_id}
            member={member}
            observationDate={observationDate}
          />
        ))}
      </tbody>
    </table>
  );
};
