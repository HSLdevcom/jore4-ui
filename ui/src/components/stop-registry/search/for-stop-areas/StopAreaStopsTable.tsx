import React, { FC } from 'react';
import { Visible } from '../../../../layoutComponents';
import {
  LoadingStopsErrorRow,
  LoadingStopsRow,
  StopSearchResultStopsTable,
} from '../components';
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
        <StopSearchResultStopsTable stops={stops} />
      </Visible>
    </div>
  );
};
