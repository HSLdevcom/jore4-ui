import { sortBy } from 'lodash';
import { PassingTimeByStopFragment } from '../../../generated/graphql';
import {
  HighlightProps,
  PassingTimesByStopTableRowPassingMinute,
} from './PassingTimesByStopTableRowPassingMinute';

type Props = {
  hour: string;
  passingTimes: PassingTimeByStopFragment[];
} & HighlightProps;

export const PassingTimesByStopTableRowPassingTime = ({
  hour,
  passingTimes,
  selectedPassingTime,
  setSelectedPassingTime,
}: Props): JSX.Element => {
  const sortedPassingTimes = sortBy(
    passingTimes,
    (passingTime) => passingTime.departure_time,
  );

  return (
    <span className="my-2 mr-3 inline-block space-x-2 whitespace-nowrap border-b border-dashed border-grey">
      <span className="text-lg font-bold">{hour}</span>
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
