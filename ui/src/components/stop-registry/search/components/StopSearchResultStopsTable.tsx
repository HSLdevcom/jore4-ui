import { DateTime } from 'luxon';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { getGeometryPoint } from '../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../components';
import { LocatableStop } from '../../types';

const testIds = {
  table: 'StopSearchByStopResultList::table',
};

type StopSearchResultRowProps = {
  readonly observationDate: DateTime;
  readonly stop: StopSearchRow;
};
const StopSearchResultRow: FC<StopSearchResultRowProps> = ({
  observationDate,
  stop,
}) => {
  const locatableStop: LocatableStop = {
    label: stop.publicCode,
    netextId: stop.netexId,
    location: getGeometryPoint(stop.location),
  };

  return (
    <StopTableRow
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <ShowOnMap key="showOnMap" stop={locatableStop} />,
        <OpenDetailsPage key="openDetails" stop={locatableStop} />,
      ]}
      observationDate={observationDate}
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
  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  return (
    <table
      className={twMerge('h-1 w-full border-x border-x-light-grey', className)}
      data-testid={testIds.table}
    >
      <tbody>
        {stops.map((stop: StopSearchRow) => (
          <StopSearchResultRow
            key={stop.id}
            observationDate={observationDate ?? null}
            stop={stop}
          />
        ))}
      </tbody>
    </table>
  );
};
