import { TimetableWithMetadata } from '../../../hooks';
import { VehicleRouteTimetableSection } from './VehicleRouteTimetableSection';

interface Props {
  timetables: TimetableWithMetadata[];
}

export const VehicleRouteTimetables = ({ timetables }: Props): JSX.Element => {
  return (
    <div className="grid gap-y-5">
      {timetables.map((item, index) => (
        <VehicleRouteTimetableSection
          key={item.journeyPatternId}
          timetable={item}
          initiallyOpen={index === 0}
        />
      ))}
    </div>
  );
};
