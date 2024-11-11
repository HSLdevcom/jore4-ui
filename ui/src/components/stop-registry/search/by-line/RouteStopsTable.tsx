import React, { FC } from 'react';
import { Visible } from '../../../../layoutComponents';
import {
  LoadingStopsErrorRow,
  LoadingStopsRow,
  StopSearchResultStopsTable,
} from '../components';
import { RouteInfoRow } from './RouteInfoRow';
import { FindStopByLineRouteInfo } from './useFindLinesByStopSearch';
import { useGetStopResultsByRouteId } from './useGetStopResultsByRouteId';

type RouteStopsTableProps = {
  readonly className?: string;
  // Enable asynchronous rendering of the result tables on the background.
  // Aka, do not lock up the ui.
  readonly lineTransitionInProgress: boolean;
  readonly route: FindStopByLineRouteInfo;
};

export const RouteStopsTable: FC<RouteStopsTableProps> = ({
  className,
  lineTransitionInProgress,
  route,
}) => {
  const { error, loading, refetch, stops } = useGetStopResultsByRouteId(
    route.route_id,
  );

  return (
    <div className={className}>
      <RouteInfoRow route={route} />

      <Visible
        visible={lineTransitionInProgress || (loading && stops.length === 0)}
      >
        <LoadingStopsRow />
      </Visible>

      <Visible visible={!!error}>
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      </Visible>

      <Visible visible={!lineTransitionInProgress && stops.length > 0}>
        <StopSearchResultStopsTable stops={stops} />
      </Visible>
    </div>
  );
};
