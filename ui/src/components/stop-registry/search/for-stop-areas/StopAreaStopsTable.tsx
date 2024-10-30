import React, { FC } from 'react';
import { Visible } from '../../../../layoutComponents';
import { LoadingStopsErrorRow, LoadingStopsRow } from '../components';
import { StopTableRow } from '../StopTableRow';
import { LocatorActionButton } from '../StopTableRow/ActionButtons/LocatorActionButton';
import { OpenDetailsPage } from '../StopTableRow/MenuItems/OpenDetailsPage';
import { ShowOnMap } from '../StopTableRow/MenuItems/ShowOnMap';
import { StopAreaHeader } from './StopAreaHeader';
import { FindStopAreaInfo } from './useFindStopAreas';
import { useGetStopResultByStopAreaId } from './useGetStopResultByStopAreaId';

type StopAreaStopsTableProps = {
  readonly className?: string;
  readonly stopArea: FindStopAreaInfo;
};

export const StopAreaStopsTable: FC<StopAreaStopsTableProps> = ({
  className,
  stopArea,
}) => {
  const { error, loading, refetch, stops } = useGetStopResultByStopAreaId(
    stopArea.id,
  );

  return (
    <div className={className}>
      <StopAreaHeader stopArea={stopArea} />

      <Visible visible={loading && stops.length === 0}>
        <LoadingStopsRow />
      </Visible>

      <Visible visible={!!error}>
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      </Visible>

      <Visible visible={stops.length > 0}>
        <table className="border-x border-t border-x-light-grey border-t-light-grey">
          <tbody>
            {stops.map((stop) => (
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
      </Visible>
    </div>
  );
};
