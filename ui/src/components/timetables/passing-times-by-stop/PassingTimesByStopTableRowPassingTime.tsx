import sortBy from 'lodash/sortBy';
import { PassingTimeByStopFragment } from '../../../generated/graphql';
import {
  HighlightProps,
  PassingTimesByStopTableRowPassingMinute,
} from './PassingTimesByStopTableRowPassingMinute';

const testIds = {
  hour: 'PassingTimesByStopTableRowPassingTime::hour',
  timeContainer: 'PassingTimesByStopTableRowPassingTime::timeContainer',
};

type Props = {
  hour: string;
  passingTimes: ReadonlyArray<PassingTimeByStopFragment>;
} & HighlightProps;

export const PassingTimesByStopTableRowPassingTime = ({
  hour,
  passingTimes,
  selectedPassingTime,
  setSelectedPassingTime,
}: Props): React.ReactElement => {
  const sortedPassingTimes = sortBy(
    passingTimes,
    (passingTime) => passingTime.passing_time,
  );

  return (
    <span
      className="my-2 mr-5 inline-flex h-8 space-x-2 whitespace-nowrap border-b border-dashed border-grey"
      data-testid={testIds.timeContainer}
    >
      <span
        className="font-narrow text-lg font-bold"
        data-testid={testIds.hour}
      >
        {hour}
      </span>
      {sortedPassingTimes.map((passingTime) => (
        <PassingTimesByStopTableRowPassingMinute
          key={passingTime.timetabled_passing_time_id}
          passingTime={passingTime}
          selectedPassingTime={selectedPassingTime}
          setSelectedPassingTime={setSelectedPassingTime}
        />
      ))}
    </span>
  );
};
