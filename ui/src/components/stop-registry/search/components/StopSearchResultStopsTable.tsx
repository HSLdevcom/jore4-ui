import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { mapLngLatToPoint } from '../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../components';
import { LocatableStop } from '../../types';
import { StopTableRow } from '../StopTableRow';
import { StopSearchRow } from '../types';

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

type StopSearchResultRowProps = { readonly stop: StopSearchRow };
const StopSearchResultRow: FC<StopSearchResultRowProps> = ({ stop }) => {
  const locatableStop: LocatableStop = {
    label: stop.label,
    netextId: stop.quay.netexId ?? null,
    location: mapLngLatToPoint(stop.measured_location.coordinates),
  };

  return (
    <StopTableRow
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <ShowOnMap key="showOnMap" stop={locatableStop} />,
        <OpenDetailsPage key="openDetails" stop={locatableStop} />,
      ]}
      stop={stop}
    />
  );
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
          <StopSearchResultRow key={stop.scheduled_stop_point_id} stop={stop} />
        ))}
      </tbody>
    </table>
  );
};
