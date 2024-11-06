import { FC } from 'react';
import { StopTableRow } from '../StopTableRow';
import { LocatorActionButton } from '../StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from '../StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../StopTableRow/MenuItems/ShowOnMap';
import { StopSearchRow } from '../types';

interface Props {
  stops: ReadonlyArray<StopSearchRow>;
}

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

export const StopSearchByStopResultList: FC<Props> = ({ stops }) => {
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
