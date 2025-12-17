import { FC, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../../hooks';
import {
  StopSearchRow,
  mapEnrichedStopPlaceStopAreaQuaysToStopSearchRows,
} from '../../../components';
import { StopAreaComponentProps } from '../types';
import { StopAreaMemberNoStops } from './StopAreaMemberNoStops';
import { StopAreaMemberStopRow } from './StopAreaMemberStopRow';

export const StopAreaMemberStopRows: FC<StopAreaComponentProps> = ({
  area,
  className,
}) => {
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const memberStops: ReadonlyArray<StopSearchRow> = useMemo(
    () => mapEnrichedStopPlaceStopAreaQuaysToStopSearchRows(area),
    [area],
  );

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
            key={member.id}
            member={member}
            observationDate={observationDate}
          />
        ))}
      </tbody>
    </table>
  );
};
