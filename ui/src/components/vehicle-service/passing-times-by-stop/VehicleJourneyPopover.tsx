import { Duration } from 'luxon';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <Popover className="ml-10" onClose={onClose}>
      <div className="mb-1 space-x-3">
        <h5 className="inline text-lg">!Label</h5>
        <span className="text-sm">
          {t('timetables.at', { time: mapDurationToShortTime(passingTime) })}
        </span>
      </div>
      <p className="text-sm">!Kalustotyyppi</p>
      <p className="text-sm">!Liikennöitsijä</p>
    </Popover>
  );
};
