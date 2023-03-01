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
}

/**
 * Displays common information about vehicle journey group, including its validity,
 * number of trips and first and last trip
 */
export const VehicleJourneyGroupInfo = ({
  vehicleJourneyGroup,
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
    <Row className="items-center space-x-4 text-sm text-hsl-dark-80">
      <IconButton
        className={`h-8 w-16 rounded-sm border border-light-grey bg-white text-base ${commonHoverStyle} hover:bg-light-grey`}
        onClick={changeVehicleScheduleFrameValidity}
        icon={<i className="icon-calendar" />}
        testId={testIds.changeValidityButton}
      />
      <p className="">
        {`${mapToShortDate(
          vehicleJourneyGroup.validity.validityStart,
        )} - ${mapToShortDate(vehicleJourneyGroup.validity.validityEnd)}`}
      </p>
      <p>|</p>
      <p className="font-bold">
        {t('timetables.tripCount', { count: tripCount })}
      </p>
      <p>|</p>
      <p>{`${mapDurationToShortTime(
        firstTrip.start_time,
      )}  ...  ${mapDurationToShortTime(lastTrip.start_time)}`}</p>
    </Row>
  );
};
