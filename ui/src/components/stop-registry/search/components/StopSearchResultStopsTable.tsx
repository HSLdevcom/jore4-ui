import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopTableRow } from '../StopTableRow';
import { LocatorActionButton } from '../StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from '../StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../StopTableRow/MenuItems/ShowOnMap';
import { StopSearchRow } from '../types';

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

type StopSearchResultStopsTableProps = {
  readonly className?: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
};

export const StopSearchResultStopsTable: FC<
  StopSearchResultStopsTableProps
> = ({ className, stops }) => {
  return (
    <table
      className={twMerge('h-1 w-full border-x border-x-light-grey', className)}
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
