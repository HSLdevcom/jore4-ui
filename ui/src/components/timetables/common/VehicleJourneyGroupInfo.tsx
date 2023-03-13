import orderBy from 'lodash/orderBy';
import { useTranslation } from 'react-i18next';
import { VehicleJourneyGroup } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { mapDurationToShortTime, mapToShortDate } from '../../../time';
import { IconButton, commonHoverStyle } from '../../../uiComponents';

const testIds = {
  changeValidityButton: 'VehicleJourneyGroupInfo::changeValidityButton',
};

export interface Props {
  vehicleJourneyGroup: VehicleJourneyGroup;
  className?: string;
}

/**
 * Displays common information about vehicle journey group, including its validity,
 * number of trips and first and last trip
 */
export const VehicleJourneyGroupInfo = ({
  vehicleJourneyGroup,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const changeVehicleScheduleFrameValidity = () => {
    // TODO: Implement
    // eslint-disable-next-line no-console
    console.log('TODO!');
  };

  const { vehicleJourneys } = vehicleJourneyGroup;

  const tripCount = vehicleJourneys.length;
  const orderedVehicleJourneys = orderBy(vehicleJourneys, 'start_time');

  const firstTrip = orderedVehicleJourneys[0];
  const lastTrip = orderedVehicleJourneys[orderedVehicleJourneys.length - 1];

  return (
    <Row
      className={`items-center space-x-4 text-center text-sm text-hsl-dark-80 ${className}`}
    >
      <IconButton
        className={`mr-2 h-8 w-16 rounded-sm border border-light-grey bg-white text-base ${commonHoverStyle} hover:bg-light-grey`}
        onClick={changeVehicleScheduleFrameValidity}
        icon={<i className="icon-calendar" />}
        testId={testIds.changeValidityButton}
      />
      <span>
        {`${mapToShortDate(
          vehicleJourneyGroup.validity.validityStart,
        )} - ${mapToShortDate(vehicleJourneyGroup.validity.validityEnd)}`}
      </span>
      <span>|</span>
      <span className="font-bold">
        {t('timetables.tripCount', { count: tripCount })}
      </span>
      <span>|</span>
      <span>{`${mapDurationToShortTime(
        firstTrip.start_time,
      )}  ...  ${mapDurationToShortTime(lastTrip.start_time)}`}</span>
    </Row>
  );
};
