import { gql } from '@apollo/client';
import groupBy from 'lodash/groupBy';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  JourneyPatternStopFragment,
  PassingTimeByStopFragment,
} from '../../../generated/graphql';
import { Column } from '../../../layoutComponents';
import { filterHighestPriorityCurrentStops } from '../../../utils';
import { HighlightProps } from './PassingTimesByStopTableRowPassingMinute';
import { PassingTimesByStopTableRowPassingTime } from './PassingTimesByStopTableRowPassingTime';

const GQL_PASSING_TIME = gql`
  fragment passing_time_by_stop on timetables_passing_times_timetabled_passing_time {
    arrival_time
    departure_time
    passing_time
    scheduled_stop_point_in_journey_pattern_ref_id
    timetabled_passing_time_id
    vehicle_journey_id
    scheduled_stop_point_in_journey_pattern_ref {
      journey_pattern_ref {
        journey_pattern_ref_id
        observation_timestamp
      }
      scheduled_stop_point_in_journey_pattern_ref_id
      scheduled_stop_point_label
      scheduled_stop_point_instances {
        ...scheduled_stop_point_default_fields
        timing_place {
          label
          timing_place_id
        }
      }
    }
    vehicle_journey {
      vehicle_journey_id
      block {
        block_id
        vehicle_type {
          description_i18n
          vehicle_type_id
        }
      }
    }
  }
`;

export const cellClassNames = 'border border-brand p-1 px-3';

const testIds = {
  tableRow: (stopLabel: string) => `PassingTimesByStopTableRow::${stopLabel}`,
};

type PassingTimesByStopTableRowProps = {
  readonly passingTimes: ReadonlyArray<PassingTimeByStopFragment>;
  // TODO: Make this required! For now it has to be optional,
  // as seed data does not contain proper journey patterns for all timetables
  readonly journeyPatternStop?: JourneyPatternStopFragment;
} & HighlightProps;

export const PassingTimesByStopTableRow: FC<
  PassingTimesByStopTableRowProps
> = ({
  passingTimes,
  selectedPassingTime,
  journeyPatternStop,
  setSelectedPassingTime,
}) => {
  const { t } = useTranslation();

  // This component only shows information about one stop and one journey pattern.
  // Therefore, we can just take first of the scheduled stop point in journey pattern ref
  // instances as they all contain the same information.
  const scheduledStopPointInJourneyPatternRef =
    passingTimes[0].scheduled_stop_point_in_journey_pattern_ref;

  const label =
    scheduledStopPointInJourneyPatternRef?.scheduled_stop_point_label;

  const passingTimesByHour = groupBy(
    passingTimes,
    (passingTime) => passingTime.passing_time.hours,
  );

  const stopMetadata = filterHighestPriorityCurrentStops(
    scheduledStopPointInJourneyPatternRef.scheduled_stop_point_instances,
    scheduledStopPointInJourneyPatternRef.journey_pattern_ref
      .observation_timestamp,
  )[0];

  const isUsedAsTimingPoint = journeyPatternStop?.is_used_as_timing_point;

  return (
    <tr
      className="odd:bg-hsl-neutral-blue"
      data-testid={testIds.tableRow(label)}
    >
      <td className={`py-3 ${cellClassNames}`}>
        <Column>
          <h5>{label}</h5>
          <p className="text-sm">!Pysäkin nimi</p>
          <p className="mt-3 text-sm">
            {isUsedAsTimingPoint
              ? stopMetadata?.timing_place?.label
              : t('timetables.interpolated')}
          </p>
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
