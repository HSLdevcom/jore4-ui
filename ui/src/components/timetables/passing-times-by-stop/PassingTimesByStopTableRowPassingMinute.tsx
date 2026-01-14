import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { PassingTimeByStopFragment } from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Visible } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { mapDurationToShortTime, padToTwoDigits } from '../../../time';
import { VehicleJourneyPopover } from './VehicleJourneyPopover';

/**
 * Common props for PassingTimesByStopTableRow and its child components.
 * This is annoying prop drilling, but using redux here feels like an overkill.
 */
export type HighlightProps = {
  readonly selectedPassingTime?: PassingTimeByStopFragment;
  readonly setSelectedPassingTime: (
    passingTime: PassingTimeByStopFragment | undefined,
  ) => void;
};

const testIds = {
  selectPassingTimeButton: 'PassingTimesByStopTableRowPassingMinute::button',
  arrivalTime: 'PassingTimesByStopTableRowPassingMinute::arrivalTime',
  departureTime: 'PassingTimesByStopTableRowPassingMinute::departureTime',
};

type PassingTimesByStopTableRowPassingMinuteProps = {
  readonly passingTime: PassingTimeByStopFragment;
} & HighlightProps;

export const PassingTimesByStopTableRowPassingMinute: FC<
  PassingTimesByStopTableRowPassingMinuteProps
> = ({ passingTime, selectedPassingTime, setSelectedPassingTime }) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const { showArrivalTimes } = useAppSelector(selectTimetable);
  const passing = passingTime.passing_time;

  // If arrival is undefined, arrival time is same as passing time
  const arrival = passingTime.arrival_time ?? passing;

  // Highlight passing minute, if it belongs to the same vehicle journey as selected passing minute
  const isHighlighted =
    selectedPassingTime?.vehicle_journey_id === passingTime.vehicle_journey_id;

  const isSelected =
    selectedPassingTime?.timetabled_passing_time_id ===
    passingTime.timetabled_passing_time_id;

  // Display arrival time only if it differs from passing time (!== operator does not work here, since the departure
  // time can be explicitly specified to be the same as the arrival time. So we do not want to test for object equality,
  // but for equal values.)
  const displayArrival = showArrivalTimes && !passing.equals(arrival);

  // If arrival time is not at the same hour as passing, display also arrival hours,
  // otherwise only display minutes
  const displayedArrival =
    arrival.hours !== passing.hours
      ? mapDurationToShortTime(arrival)
      : padToTwoDigits(arrival.minutes);

  const highlightClassName = isHighlighted
    ? ' border-hsl-highlight-yellow-dark bg-city-bicycle-yellow'
    : '';

  return (
    <span className="inline-flex">
      <button
        data-highlighted={isHighlighted}
        className={twMerge(
          'inline-flex flex-col items-end rounded-xs border border-transparent px-0.5 align-text-bottom text-xs',
          'px-1 hover:border-hsl-highlight-yellow-dark hover:bg-city-bicycle-yellow',
          highlightClassName,
        )}
        onClick={() => setSelectedPassingTime(passingTime)}
        type="button"
        data-testid={testIds.selectPassingTimeButton}
      >
        <span className="flex h-full flex-col justify-center">
          <span
            data-testid={testIds.arrivalTime}
            className={`text-2xs leading-tight ${
              displayArrival ? '' : 'hidden'
            }`}
          >
            {displayedArrival}
          </span>
          <span data-testid={testIds.departureTime}>
            {padToTwoDigits(passing.minutes)}
          </span>
        </span>
      </button>
      <Visible visible={isSelected}>
        <VehicleJourneyPopover
          passingTime={passing}
          vehicleTypeDescription={getLocalizedTextFromDbBlob(
            passingTime.vehicle_journey.block.vehicle_type?.description_i18n,
          )}
          onClose={() => setSelectedPassingTime(undefined)}
        />
      </Visible>
    </span>
  );
};
