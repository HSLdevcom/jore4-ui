import { gql } from '@apollo/client';
import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { FC } from 'react';
import { PulseLoader } from 'react-spinners';
import { useResolveTimingPointNamesQuery } from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';
import {
  KeyedChangedValue,
  diffKeyedValues,
} from '../../../common/ChangeHistory';
import { RouteData, RouteStopData } from '../types';
import { RouteStopsList } from './diffStopDrivingOrder';

const testIds = {
  timingPoint: (label: string) =>
    `ChangeHistory::ChangedValues::RouteDetails::TimingPoint::${label}`,
};

const GQL_RESOLVE_TIMING_POINT_NAMES = gql`
  query ResolveTimingPointNames($stopLabels: [String!]!) {
    timing_pattern_timing_place(
      where: { scheduled_stop_points: { label: { _in: $stopLabels } } }
      order_by: [{ label: asc }]
    ) {
      timing_place_id
      label
    }
  }
`;

type RouteTimingPointsListProps = {
  readonly stopLabels: ReadonlyArray<string>;
};
const RouteTimingPointsList: FC<RouteTimingPointsListProps> = ({
  stopLabels,
}) => {
  const { data, loading } = useResolveTimingPointNamesQuery({
    variables: { stopLabels },
  });

  if (loading) {
    return <PulseLoader color={theme.colors.brand} size={12} />;
  }

  const timingPointLabels = compact(
    data?.timing_pattern_timing_place.map((it) => it.label),
  );

  return (
    <ol className="flex list-none flex-wrap gap-y-1">
      {timingPointLabels.map((label) => (
        <li
          key={label}
          data-testid={testIds.timingPoint(label)}
          className="basis-1/3 px-1.5"
        >
          {label}
        </li>
      ))}
    </ol>
  );
};

function uniqueSortedStopLabels(
  stops: ReadonlyArray<RouteStopData>,
): Array<string> {
  return uniq(stops.map((it) => it.scheduled_stop_point_label)).sort();
}

export function diffTimingPoints(
  t: TFunction,
  previous: RouteData,
  current: RouteData,
): Array<KeyedChangedValue | null> {
  const previousTimingPoints = previous.stops.filter(
    (it) => it.is_used_as_timing_point,
  );
  const previousRegulationPoints = previousTimingPoints.filter(
    (it) => it.is_regulated_timing_point,
  );
  const previousLoadingPoints = previousRegulationPoints.filter(
    (it) => it.is_loading_time_allowed,
  );

  const currentTimingPoints = current.stops.filter(
    (it) => it.is_used_as_timing_point,
  );
  const currentRegulationPoints = currentTimingPoints.filter(
    (it) => it.is_regulated_timing_point,
  );
  const currentLoadingPoints = currentRegulationPoints.filter(
    (it) => it.is_loading_time_allowed,
  );

  return [
    diffKeyedValues({
      key: 'TimingPoints',
      field: t(($) => $.lineChangeHistory.extraFields.usedTimingPoints),
      oldValue: uniqueSortedStopLabels(previousTimingPoints),
      newValue: uniqueSortedStopLabels(currentTimingPoints),
      mapper: (stopLabels) => <RouteTimingPointsList stopLabels={stopLabels} />,
    }),
    diffKeyedValues({
      key: 'RegulatedTimingPoints',
      field: t(
        ($) => $.lineChangeHistory.extraFields.usedRegulatedTimingPoints,
      ),
      oldValue: previousRegulationPoints.map(
        (it) => it.scheduled_stop_point_label,
      ),
      newValue: currentRegulationPoints.map(
        (it) => it.scheduled_stop_point_label,
      ),
      mapper: (stopLabels) => <RouteStopsList t={t} stopLabels={stopLabels} />,
    }),
    diffKeyedValues({
      key: 'LoadingTimeAllowedOn',
      field: t(($) => $.lineChangeHistory.extraFields.loadingTimeAllowedOn),
      oldValue: previousLoadingPoints.map(
        (it) => it.scheduled_stop_point_label,
      ),
      newValue: currentLoadingPoints.map((it) => it.scheduled_stop_point_label),
      mapper: (stopLabels) => <RouteStopsList t={t} stopLabels={stopLabels} />,
    }),
  ];
}
