import { Duration } from 'luxon';
import { FC } from 'react';
import { mapDurationToShortTime } from '../../../time';
import { Popover } from '../../../uiComponents';

type VehicleJourneyPopoverProps = {
  readonly passingTime: Duration;
  readonly vehicleTypeDescription: string;
  readonly onClose: () => void;
};

export const VehicleJourneyPopover: FC<VehicleJourneyPopoverProps> = ({
  passingTime,
  vehicleTypeDescription,
  onClose,
}) => {
  return (
    <Popover className="ml-10" onClose={onClose}>
      <div className="mb-1 space-x-3">
        <h5 className="inline text-lg">
          {mapDurationToShortTime(passingTime)}
        </h5>
      </div>
      <p className="text-sm">{vehicleTypeDescription}</p>
      <p className="text-sm">!Liikennöitsijä</p>
    </Popover>
  );
};
