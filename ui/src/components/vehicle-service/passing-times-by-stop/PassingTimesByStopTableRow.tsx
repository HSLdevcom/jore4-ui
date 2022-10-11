import { gql } from '@apollo/client';
import { sortBy } from 'lodash';
import { groupBy } from 'remeda';
import { PassingTimeFragment } from '../../../generated/graphql';
import { Column, Visible } from '../../../layoutComponents';

const GQL_PASSING_TIME = gql`
  fragment passing_time on timetables_passing_times_timetabled_passing_time {
    arrival_time
    departure_time
    scheduled_stop_point_in_journey_pattern_ref_id
    timetabled_passing_time_id
    vehicle_journey_id
    scheduled_stop_point_in_journey_pattern_ref {
      journey_pattern_ref_id
      scheduled_stop_point_in_journey_pattern_ref_id
      scheduled_stop_point_label
      scheduled_stop_point_label_passing
    }
  }
`;

const GQL_VEHICLE_JOURNEY = gql`
  fragment vehicle_journey on timetables_vehicle_journey_vehicle_journey {
    timetabled_passing_times {
      ...passing_time
    }
    journey_pattern_ref_id
    vehicle_journey_id
  }
`;

interface PassingMinuteProps {
  passingTime: PassingTimeFragment;
}

const PassingMinute = ({ passingTime }: PassingMinuteProps): JSX.Element => {
  const departure = passingTime?.departure_time || passingTime.arrival_time;

  const displayArrival = departure !== passingTime.arrival_time;

  return (
    <span className="inline-flex flex-col text-right align-text-bottom text-xs">
      <Visible visible={displayArrival}>
        <div className="mt-2 text-2xs">{passingTime.arrival_time.minutes}</div>
      </Visible>
      <div>{departure.minutes}</div>
    </span>
  );
};

interface PassingTimeProps {
  hour: string;
  passingTimes: PassingTimeFragment[];
}

const PassingTimes = ({
  hour,
  passingTimes,
}: PassingTimeProps): JSX.Element => {
  const sortedPassingTimes = sortBy(
    passingTimes,
    (passingTime) => passingTime.arrival_time,
  );

  return (
    <span className="my-2 mr-3 inline-block space-x-2 whitespace-nowrap border-b border-dashed border-grey">
      <span className="text-lg font-bold">{hour}</span>
      {sortedPassingTimes.map((passingTime) => (
        <PassingMinute
          key={passingTime.arrival_time.toString()}
          passingTime={passingTime}
        />
      ))}
    </span>
  );
};

export const cellClassNames = 'border border-brand p-1 px-3';

interface RowProps {
  passingTimes: PassingTimeFragment[];
}

export const PassingTimesByStopTableRow = ({
  passingTimes,
}: RowProps): JSX.Element => {
  const label =
    passingTimes[0].scheduled_stop_point_in_journey_pattern_ref
      ?.scheduled_stop_point_label;

  const passingTimesByHour = groupBy(
    passingTimes,
    (passingTime) => passingTime.arrival_time.hours,
  );

  return (
    <tr className="odd:bg-hsl-neutral-blue even:bg-white">
      <td className={`py-3 ${cellClassNames}`}>
        <Column>
          <h5>{label}</h5>
          <p className="text-sm">!Pysäkin nimi</p>
          <p className="mt-3 text-sm">!Hastuspaikan koodi</p>
        </Column>
      </td>
      <td className={`break-words py-3 ${cellClassNames}`}>
        {Object.entries(passingTimesByHour).map(([hour, hourPassingTimes]) => (
          <PassingTimes
            key={hour}
            hour={hour}
            passingTimes={hourPassingTimes}
          />
        ))}
      </td>
    </tr>
  );
};
