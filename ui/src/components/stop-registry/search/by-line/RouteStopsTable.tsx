import { DateTime } from 'luxon';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  SelectableStopSearchResultStopsTable,
} from '../components';
import { ResultSelection, SortingInfo } from '../types';
import { createCompositeKey, useGroupedResultSelection } from '../utils';
import { RouteInfoRow } from './RouteInfoRow';
import { FindStopByLineRouteInfo } from './useFindLinesByStopSearch';
import { useGetStopResultsByRouteId } from './useGetStopResultsByRouteId';

const testIds = {
  container: (id: UUID) => `StopSearchByLine::route::${id}`,
  loader: 'StopSearch::GroupedStops::loader',
};

type RouteStopsTableProps = {
  readonly className?: string;
  // Enable asynchronous rendering of the result tables on the background.
  // Aka, do not lock up the ui.
  readonly lineTransitionInProgress: boolean;
  readonly observationDate: DateTime;
  readonly route: FindStopByLineRouteInfo;
  readonly sortingInfo: SortingInfo;
  readonly selection: ResultSelection;
};

export const RouteStopsTable: FC<RouteStopsTableProps> = ({
  className,
  lineTransitionInProgress,
  observationDate,
  route,
  sortingInfo,
  selection,
}) => {
  const { t } = useTranslation();

  const { error, loading, refetch, stops } = useGetStopResultsByRouteId(
    route.route_id,
    sortingInfo.sortOrder,
  );

  const { onRegisterNewGroup, onBatchUpdateSelection, onToggleSelection } =
    useGroupedResultSelection();

  useEffect(() => {
    const compositeKeys = stops.map((stop) =>
      createCompositeKey(route.route_id, stop.netexId),
    );
    onRegisterNewGroup(route.route_id, compositeKeys);
  }, [onRegisterNewGroup, route.route_id, stops]);

  const onToggleSelectionForRoute = useMemo(
    () => (stopId: string) => {
      onToggleSelection(createCompositeKey(route.route_id, stopId));
    },
    [onToggleSelection, route.route_id],
  );

  return (
    <div className={className} data-testid={testIds.container(route.route_id)}>
      <RouteInfoRow
        route={route}
        onBatchUpdateSelection={onBatchUpdateSelection}
        selection={selection}
        stops={stops}
      />

      <Visible visible={!!error}>
        <LoadingStopsErrorRow
          className="ml-[calc(3rem+1px)]"
          error={error}
          refetch={refetch}
        />
      </Visible>

      <LoadingWrapper
        testId={testIds.loader}
        className="ml-[calc(3rem+1px)] flex justify-center border border-light-grey p-8"
        loadingText={t('search.searching')}
        loading={lineTransitionInProgress || (loading && stops.length === 0)}
      >
        <Visible visible={!lineTransitionInProgress && stops.length > 0}>
          <SelectableStopSearchResultStopsTable
            observationDate={observationDate}
            stops={stops}
            onToggleSelection={onToggleSelectionForRoute}
            routeId={route.route_id}
            selection={selection}
          />
        </Visible>
      </LoadingWrapper>
    </div>
  );
};
