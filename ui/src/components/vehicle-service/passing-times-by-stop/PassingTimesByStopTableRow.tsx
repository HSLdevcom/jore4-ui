import { gql } from '@apollo/client';
import { groupBy } from 'remeda';
import { PassingTimeByStopFragment } from '../../../generated/graphql';
import { Column } from '../../../layoutComponents';
import { HighlightProps } from './PassingTimesByStopTableRowPassingMinute';
import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

const GQL_PASSING_TIME = gql`
  fragment passing_time_by_stop on timetables_passing_times_timetabled_passing_time {
    arrival_time
    departure_time
    scheduled_stop_point_in_journey_pattern_ref_id
    timetabled_passing_time_id
    vehicle_journey_id
    scheduled_stop_point_in_journey_pattern_ref {
      scheduled_stop_point_in_journey_pattern_ref_id
      scheduled_stop_point_label
    }
  }
`;

export const cellClassNames = 'border border-brand p-1 px-3';

const testIds = {
  tr: 'PassingTimesByStopTableRow',
};

type Props = {
  passingTimes: PassingTimeByStopFragment[];
} & HighlightProps;

export const PassingTimesByStopTableRow = ({
  passingTimes,
  selectedPassingTime,
  setSelectedPassingTime,
}: Props): JSX.Element => {
  const label =
    passingTimes[0].scheduled_stop_point_in_journey_pattern_ref
      ?.scheduled_stop_point_label;

  const passingTimesByHour = groupBy(
    passingTimes,
    (passingTime) =>
      // Group by departure hour. If departure is not defined, departure is same as arrival
      passingTime?.departure_time?.hours || passingTime.arrival_time.hours,
  );

  return (
    <tr className="odd:bg-hsl-neutral-blue" data-testid={testIds.tr}>
      <td className={`py-3 ${cellClassNames}`}>
        <Column>
          <h5>{label}</h5>
          <p className="text-sm">!Pysäkin nimi</p>
          <p className="mt-3 text-sm">!Hastuspaikan koodi</p>
        </Column>
      </td>
      <td className={`break-words py-3 align-top ${cellClassNames}`}>
        {Object.entries(passingTimesByHour).map(([hour, hourPassingTimes]) => (
          <PassingTimesByStopTableRowPassingTime
            key={hour}
            hour={hour}
            passingTimes={hourPassingTimes}
            selectedPassingTime={selectedPassingTime}
            setSelectedPassingTime={setSelectedPassingTime}
          />
        ))}
      </td>
    </tr>
  );
};
