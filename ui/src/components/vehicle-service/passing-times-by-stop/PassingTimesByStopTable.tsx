import { useTranslation } from 'react-i18next';
import { groupBy, pipe } from 'remeda';
import { VehicleJourneyFragment } from '../../../generated/graphql';
import {
  cellClassNames,
  PassingTimesByStopTableRow,
} from './PassingTimesByStopTableRow';

const testIds = {
  table: 'PassingTimesByStopTable::table',
};

interface Props {
  vehicleJourneys: VehicleJourneyFragment[];
  className?: string;
}

export const PassingTimesByStopTable = ({
  vehicleJourneys,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

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
      <thead className="bg-white text-left">
        <tr>
          <th className={`${cellClassNames}`}>{t('stops.stop')}</th>
          <th className={`${cellClassNames}`}>{t('timetables.departures')}</th>
        </tr>
      </thead>
      <tbody>
        {Object.values(passingTimesByStop).map((stopPassingTimes) => (
          <PassingTimesByStopTableRow
            key={
              stopPassingTimes[0].scheduled_stop_point_in_journey_pattern_ref_id
            }
            passingTimes={stopPassingTimes}
          />
        ))}
      </tbody>
    </table>
  );
};
