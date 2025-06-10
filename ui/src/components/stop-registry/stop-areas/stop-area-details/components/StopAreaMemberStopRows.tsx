import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { EnrichedStopPlace } from '../../../../../types';
import { StopAreaComponentProps, StopAreaMemberRow } from '../types';
import { mapMembersToStopSearchFormat } from '../utils';
import { StopAreaMemberNoStops } from './StopAreaMemberNoStops';
import { StopAreaMemberStopRow } from './StopAreaMemberStopRow';

function mapRows(
  t: TFunction,
  area: EnrichedStopPlace,
): Array<StopAreaMemberRow> {
  const existingAreaMembers = mapMembersToStopSearchFormat(area);

  return existingAreaMembers.map((quay) => ({
    quay,
    selected: true,
    added: false,
  }));
}

export const StopAreaMemberStopRows: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  const { t } = useTranslation();
  const memberStops = mapRows(t, area);

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
            key={member.quay.scheduled_stop_point_id}
            member={member}
          />
        ))}
      </tbody>
    </table>
  );
};
