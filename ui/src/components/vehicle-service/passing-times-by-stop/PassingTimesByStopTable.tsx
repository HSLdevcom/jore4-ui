import { gql } from '@apollo/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { groupBy, pipe } from 'remeda';
import {
  PassingTimeByStopFragment,
  VehicleJourneyByStopFragment,
} from '../../../generated/graphql';
import {
  cellClassNames,
  PassingTimesByStopTableRow,
} from './PassingTimesByStopTableRow';

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

interface Props {
  vehicleJourneys: VehicleJourneyByStopFragment[];
  className?: string;
}

export const PassingTimesByStopTable = ({
  vehicleJourneys,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [selectedPassingTime, setSelectedPassingTime] =
    useState<PassingTimeByStopFragment>();

  if (!vehicleJourneys) return <></>;

  const passingTimesByStop = pipe(
    // Get passing times from vehicle journeys
    vehicleJourneys.flatMap(
      (vehicleJourney) => vehicleJourney.timetabled_passing_times,
    ),
    // Group passing times by stop label
    (passingTimes) =>
      groupBy(
        passingTimes,
        (item) =>
          item.scheduled_stop_point_in_journey_pattern_ref
            .scheduled_stop_point_label,
      ),
  );

  return (
    <table
      className={`w-full border border-brand ${className}`}
      data-testid={testIds.table}
    >
      <thead className="text-left">
        <tr>
          <th className={`w-1 whitespace-nowrap ${cellClassNames}`}>
            {t('stops.stop')}
          </th>
          <th className={`${cellClassNames}`}>{t('timetables.departures')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(passingTimesByStop).map(
          ([stopLabel, stopPassingTimes]) => (
            <PassingTimesByStopTableRow
              key={stopLabel}
              passingTimes={stopPassingTimes}
              selectedPassingTime={selectedPassingTime}
              setSelectedPassingTime={setSelectedPassingTime}
            />
          ),
        )}
      </tbody>
    </table>
  );
};
