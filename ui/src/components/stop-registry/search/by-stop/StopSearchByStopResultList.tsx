import { FC } from 'react';
import { StopTableRow } from '../StopTableRow';
import { LocatorActionButton } from '../StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from '../StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../StopTableRow/MenuItems/ShowOnMap';
import { StopSearchRow } from '../types';

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

type StopSearchByStopResultListProps = {
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const StopSearchByStopResultList: FC<
  StopSearchByStopResultListProps
> = ({ stops }) => {
  return (
    <table
      className="h-1 w-full border-x border-x-light-grey"
      data-testid={testIds.table}
    >
      <tbody>
        {stops?.map((stop: StopSearchRow) => (
          <StopTableRow
            key={stop.scheduled_stop_point_id}
            actionButtons={<LocatorActionButton stop={stop} />}
            menuItems={[
              <ShowOnMap key="showOnMap" stop={stop} />,
              <OpenDetailsPage key="openDetails" stop={stop} />,
            ]}
            stop={stop}
          />
        ))}
      </tbody>
    </table>
  );
};
