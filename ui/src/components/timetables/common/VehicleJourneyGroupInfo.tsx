import orderBy from 'lodash/orderBy';
import { useTranslation } from 'react-i18next';
import { VehicleJourneyGroup, useAppDispatch } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { openChangeTimetableValidityModalAction } from '../../../redux';
import { mapDurationToShortTime, mapToShortDate } from '../../../time';
import { IconButton, commonHoverStyle } from '../../../uiComponents';

const testIds = {
  changeValidityButton: 'VehicleJourneyGroupInfo::changeValidityButton',
  validityTimeRange: 'VehicleJourneyGroupInfo::validityRangeSpan',
  tripCount: 'VehicleJourneyGroupInfo::tripCount',
  tripTimeRange: 'VehicleJourneyGroupInfo::tripTimeRange',
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
  const dispatch = useAppDispatch();

  const changeVehicleScheduleFrameValidity = () => {
    if (vehicleJourneyGroup.vehicleScheduleFrameId) {
      dispatch(
        openChangeTimetableValidityModalAction(
          vehicleJourneyGroup.vehicleScheduleFrameId,
        ),
      );
    }
  };

  const { vehicleJourneys } = vehicleJourneyGroup;

  const hasTimetables = !!vehicleJourneys;
  const tripCount = vehicleJourneys?.length;
  const orderedVehicleJourneys = orderBy(vehicleJourneys, 'start_time');

  const firstTrip = orderedVehicleJourneys[0];
  const lastTrip = orderedVehicleJourneys[orderedVehicleJourneys.length - 1];

  // disable the button in case of substitute operating day
  // TODO: in the future there might be a need for using this button to
  // link to the substitute operating day's page
  const isDisabled = !vehicleJourneyGroup.vehicleScheduleFrameId;
  const hoverStyle = `${commonHoverStyle} hover:bg-light-grey`;

  return (
    <Row
      className={`items-center space-x-4 text-center text-sm text-hsl-dark-80 ${className}`}
    >
      <IconButton
        className={`mr-2 h-8 w-16 rounded-sm border border-light-grey bg-white text-base  ${
          isDisabled ? 'text-light-grey' : hoverStyle
        }`}
        disabled={isDisabled}
        onClick={changeVehicleScheduleFrameValidity}
        icon={<i className="icon-calendar" />}
        testId={testIds.changeValidityButton}
      />
      <span data-testid={testIds.validityTimeRange}>
        {`${mapToShortDate(
          vehicleJourneyGroup.validity.validityStart,
        )} - ${mapToShortDate(vehicleJourneyGroup.validity.validityEnd)}`}
      </span>
      {hasTimetables && (
        <>
          <span>|</span>
          <span className="font-bold" data-testid={testIds.tripCount}>
            {t('timetables.tripCount', { count: tripCount })}
          </span>
          <span>|</span>
          <span data-testid={testIds.tripTimeRange}>
            {`${mapDurationToShortTime(firstTrip.start_time)} ...
            ${mapDurationToShortTime(lastTrip.start_time)}`}
          </span>
        </>
      )}
    </Row>
  );
};
