import { twMerge } from 'tailwind-merge';
import { PassingTimeByStopFragment } from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { parseI18nField } from '../../../i18n/utils';
import { Visible } from '../../../layoutComponents';
import { selectTimetable } from '../../../redux';
import { mapDurationToShortTime, padToTwoDigits } from '../../../time';
import { VehicleJourneyPopover } from './VehicleJourneyPopover';

/**
 * Common props for PassingTimesByStopTableRow and its child components.
 * This is annoying prop drilling, but using redux here feels like an overkill.
 */
export interface HighlightProps {
  selectedPassingTime?: PassingTimeByStopFragment;
  setSelectedPassingTime: (
    passingTime: PassingTimeByStopFragment | undefined,
  ) => void;
}

const testIds = {
  selectPassingTimeButton: 'PassingTimesByStopTableRowPassingMinute::button',
};

type Props = {
  passingTime: PassingTimeByStopFragment;
} & HighlightProps;

export const PassingTimesByStopTableRowPassingMinute = ({
  passingTime,
  selectedPassingTime,
  setSelectedPassingTime,
}: Props): JSX.Element => {
  const { showArrivalTimes } = useAppSelector(selectTimetable);
  const passing = passingTime.passing_time;

  // If arrival is undefined, arrival time is same as passing time
  const arrival = passingTime.arrival_time || passing;

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

  return (
    <span>
      <button
        className={twMerge(
          'inline-flex flex-col items-end rounded-sm border border-transparent px-0.5 align-text-bottom text-xs',
          'hover:border-hsl-highlight-yellow-dark hover:bg-city-bicycle-yellow',
          isHighlighted
            ? ' border-hsl-highlight-yellow-dark bg-city-bicycle-yellow'
            : '',
        )}
        onClick={() => setSelectedPassingTime(passingTime)}
        type="button"
        data-testid={testIds.selectPassingTimeButton}
      >
        <span className="flex flex-col">
          <span
            className={`text-2xs leading-tight ${
              displayArrival ? '' : 'invisible'
            }`}
          >
            {displayedArrival}
          </span>
          <span>{padToTwoDigits(passing.minutes)}</span>
        </span>
      </button>
      <Visible visible={isSelected}>
        <VehicleJourneyPopover
          passingTime={passing}
          vehicleTypeDescription={parseI18nField(
            passingTime.vehicle_journey.block.vehicle_type?.description_i18n,
          )}
          onClose={() => setSelectedPassingTime(undefined)}
        />
      </Visible>
    </span>
  );
};
