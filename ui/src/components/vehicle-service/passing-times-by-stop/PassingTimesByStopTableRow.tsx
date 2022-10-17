import { gql } from '@apollo/client';
import { sortBy } from 'lodash';
import { Duration } from 'luxon';
import { useTranslation } from 'react-i18next';
import { groupBy } from 'remeda';
import { PassingTimeFragment } from '../../../generated/graphql';
import { Column, Visible } from '../../../layoutComponents';
import { durationToShortTime, timePartToString } from '../../../time';
import { Popover } from '../../../uiComponents';

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

const testIds = {
  selectPassingTimeButton: 'PassingTimesByStopTable::selectPassingTimeButton',
};

interface VehicleJourneyPopoverProps {
  departure: Duration;
  onClose: () => void;
}

const VehicleJourneyPopover = ({
  departure,
  onClose,
}: VehicleJourneyPopoverProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Popover className="ml-10" onClose={onClose}>
      <div className="mb-1 space-x-3">
        <span className="text-lg font-bold">!Label</span>
        <span className="text-sm">
          {t('timetables.at', { time: durationToShortTime(departure) })}
        </span>
      </div>
      <p className="text-sm">!Kalustotyyppi</p>
      <p className="text-sm">!Liikennöitsijä</p>
    </Popover>
  );
};

/**
 * Common props for PassingTimesByStopTableRow and its child components.
 * This is annoying prop drilling, but using redux here feels like an overkill.
 */
interface HighlightProps {
  selectedPassingTime?: PassingTimeFragment;
  setSelectedPassingTime: (
    passingTime: PassingTimeFragment | undefined,
  ) => void;
}

type PassingMinuteProps = {
  passingTime: PassingTimeFragment;
} & HighlightProps;

const PassingMinute = ({
  passingTime,
  selectedPassingTime,
  setSelectedPassingTime,
}: PassingMinuteProps): JSX.Element => {
  const arrival = passingTime.arrival_time;
  // If departure is undefined, departure time is same as arrival time
  const departure = passingTime?.departure_time || arrival;

  // Highlight passing minute, if it belongs to the same vehicle journey as selected passing minute
  const isHighlighted =
    selectedPassingTime?.vehicle_journey_id === passingTime.vehicle_journey_id;

  // Display arrival time only if it differs from departure
  const displayArrival = arrival !== departure;

  // If arrival time is not at the same hour as departure, display also arrival hours,
  // otherwise only display minutes
  const displayedArrival =
    arrival.hours !== departure.hours
      ? durationToShortTime(arrival)
      : timePartToString(arrival.minutes);

  return (
    <>
      <button
        className={`inline-flex flex-col items-end border border-transparent px-0.5 align-text-bottom text-xs ${
          isHighlighted
            ? 'rounded-sm !border-hsl-highlight-yellow-dark bg-city-bicycle-yellow'
            : ''
        }`}
        onClick={() => setSelectedPassingTime(passingTime)}
        type="button"
        data-testid={testIds.selectPassingTimeButton}
      >
        <Visible visible={displayArrival}>
          <div className="text-2xs leading-tight">{displayedArrival}</div>
        </Visible>
        <div>{timePartToString(departure.minutes)}</div>
      </button>
      <Visible
        visible={
          selectedPassingTime?.timetabled_passing_time_id ===
          passingTime.timetabled_passing_time_id
        }
      >
        <VehicleJourneyPopover
          departure={departure}
          onClose={() => setSelectedPassingTime(undefined)}
        />
      </Visible>
    </>
  );
};

type PassingTimeProps = {
  hour: string;
  passingTimes: PassingTimeFragment[];
} & HighlightProps;

const PassingTimes = ({
  hour,
  passingTimes,
  selectedPassingTime,
  setSelectedPassingTime,
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
          key={passingTime.timetabled_passing_time_id}
          passingTime={passingTime}
          selectedPassingTime={selectedPassingTime}
          setSelectedPassingTime={setSelectedPassingTime}
        />
      ))}
    </span>
  );
};

export const cellClassNames = 'border border-brand p-1 px-3';

type RowProps = {
  passingTimes: PassingTimeFragment[];
} & HighlightProps;

export const PassingTimesByStopTableRow = ({
  passingTimes,
  selectedPassingTime,
  setSelectedPassingTime,
}: RowProps): JSX.Element => {
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
    <tr className="odd:bg-hsl-neutral-blue even:bg-white">
      <td className={`py-3 ${cellClassNames}`}>
        <Column>
          <h5>{label}</h5>
          <p className="text-sm">!Pysäkin nimi</p>
          <p className="mt-3 text-sm">!Hastuspaikan koodi</p>
        </Column>
      </td>
      <td className={`break-words py-3 align-top ${cellClassNames}`}>
        {Object.entries(passingTimesByHour).map(([hour, hourPassingTimes]) => (
          <PassingTimes
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
