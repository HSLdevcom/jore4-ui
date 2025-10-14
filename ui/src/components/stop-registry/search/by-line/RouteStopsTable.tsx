import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  StopSearchResultStopsTable,
} from '../components';
import { SortingInfo } from '../types';
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
};

export const RouteStopsTable: FC<RouteStopsTableProps> = ({
  className,
  lineTransitionInProgress,
  observationDate,
  route,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { error, loading, refetch, stops } = useGetStopResultsByRouteId(
    route.route_id,
    sortingInfo.sortOrder,
  );

  return (
    <div className={className} data-testid={testIds.container(route.route_id)}>
      <RouteInfoRow route={route} />

      <Visible visible={!!error}>
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      </Visible>

      <LoadingWrapper
        testId={testIds.loader}
        className="flex justify-center border border-light-grey p-8"
        loadingText={t('search.searching')}
        loading={lineTransitionInProgress || (loading && stops.length === 0)}
      >
        <Visible visible={!lineTransitionInProgress && stops.length > 0}>
          <StopSearchResultStopsTable
            observationDate={observationDate}
            stops={stops}
          />
        </Visible>
      </LoadingWrapper>
    </div>
  );
};
