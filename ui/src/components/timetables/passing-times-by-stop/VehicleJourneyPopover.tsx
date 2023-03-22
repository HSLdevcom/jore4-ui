import { Duration } from 'luxon';
import { mapDurationToShortTime } from '../../../time';
import { Popover } from '../../../uiComponents';

interface Props {
  passingTime: Duration;
  onClose: () => void;
}

export const VehicleJourneyPopover = ({
  passingTime,
  onClose,
}: Props): JSX.Element => {
  return (
    <Popover className="ml-10" onClose={onClose}>
      <div className="mb-1 space-x-3">
        <h5 className="inline text-lg">
          {mapDurationToShortTime(passingTime)}
        </h5>
      </div>
      <p className="text-sm">!Kalustotyyppi</p>
      <p className="text-sm">!Liikennöitsijä</p>
    </Popover>
  );
};
