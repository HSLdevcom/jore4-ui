import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  PassingTimeByStopFragment,
  RouteWithJourneyPatternStopsFragment,
  VehicleJourneyByStopFragment,
} from '../../../generated/graphql';
import { PassingTimesByStopTableRow } from './PassingTimesByStopTableRow';

const testIds = {
  table: 'PassingTimesByStopTable::table',
};

const GQL_VEHICLE_JOURNEY = gql`
  fragment vehicle_journey_by_stop on timetables_vehicle_journey_vehicle_journey {
    timetabled_passing_times {
      ...passing_time_by_stop
    }
    journey_pattern_ref_id
    vehicle_journey_id
  }
`;

type PassingTimesByStopTableProps = {
  readonly vehicleJourneys: ReadonlyArray<VehicleJourneyByStopFragment>;
  readonly route: RouteWithJourneyPatternStopsFragment;
  readonly className?: string;
};

export const PassingTimesByStopTable: FC<PassingTimesByStopTableProps> = ({
  vehicleJourneys,
  route,
  className,
}) => {
  const { t } = useTranslation();
  const [selectedPassingTime, setSelectedPassingTime] =
    useState<PassingTimeByStopFragment>();

  if (!vehicleJourneys) {
    return null;
  }

  const passingTimes = vehicleJourneys.flatMap(
    (vehicleJourney) => vehicleJourney.timetabled_passing_times,
  );

  const passingTimesByStop = groupBy(
    passingTimes,
    (item) =>
      item.scheduled_stop_point_in_journey_pattern_ref
        .scheduled_stop_point_label,
  );

  const stopsInJourneyPattern =
    route.route_journey_patterns[0]
      .ordered_scheduled_stop_point_in_journey_patterns;

  return (
    <table
      className={twMerge('w-full border border-brand', className)}
      data-testid={testIds.table}
    >
      <thead className="text-left">
        <tr>
          <th className="w-1 border border-brand p-1 px-3 whitespace-nowrap">
            {t('stops.stop')}
          </th>
          <th className="border border-brand p-1 px-3">
            {t('timetables.departures')}
          </th>
        </tr>
      </thead>
      <tbody>
        {stopsInJourneyPattern.map((stopInJourneyPattern) => {
          const stopLabel = stopInJourneyPattern.scheduled_stop_point_label;
          const stopPassingTimes = passingTimesByStop[stopLabel];

          return (
            <PassingTimesByStopTableRow
              key={stopLabel}
              passingTimes={stopPassingTimes}
              journeyPatternStop={stopInJourneyPattern}
              selectedPassingTime={selectedPassingTime}
              setSelectedPassingTime={setSelectedPassingTime}
            />
          );
        })}
      </tbody>
    </table>
  );
};
