import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { VehicleJourneyWithServiceFragment } from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Row } from '../../../layoutComponents';
import { openChangeTimetableValidityModalAction } from '../../../redux';
import { mapDurationToShortTime, mapToShortDate } from '../../../time';
import { IconButton, commonHoverStyle } from '../../../uiComponents';

const testIds = {
  container: 'VehicleJourneyGroupInfo',
  changeValidityButton: 'VehicleJourneyGroupInfo::changeValidityButton',
  validityTimeRange: 'VehicleJourneyGroupInfo::validityTimeRange',
  tripCount: 'VehicleJourneyGroupInfo::tripCount',
  tripTimeRange: 'VehicleJourneyGroupInfo::tripTimeRange',
};

export interface Props {
  vehicleScheduleFrameId: UUID | null | undefined;
  vehicleJourneys:
    | Pick<VehicleJourneyWithServiceFragment, 'start_time'>[]
    | null;
  validityStart: DateTime;
  validityEnd: DateTime;
  dayTypeNameI18n: LocalizedString;
  className?: string;
}

/**
 * Displays common information about vehicle journey group, including its validity,
 * number of trips and first and last trip
 */
export const VehicleJourneyGroupInfo = ({
  vehicleScheduleFrameId,
  vehicleJourneys,
  validityStart,
  validityEnd,
  dayTypeNameI18n,
  className = '',
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const dispatch = useAppDispatch();

  const changeVehicleScheduleFrameValidity = () => {
    if (vehicleScheduleFrameId) {
      dispatch(openChangeTimetableValidityModalAction(vehicleScheduleFrameId));
    }
  };

  const hasTimetables = !!vehicleJourneys;
  const tripCount = vehicleJourneys?.length;
  const orderedVehicleJourneys = orderBy(vehicleJourneys, 'start_time');

  const firstTrip = orderedVehicleJourneys[0];
  const lastTrip = orderedVehicleJourneys[orderedVehicleJourneys.length - 1];

  // disable the button in case of substitute operating day
  // TODO: in the future there might be a need for using this button to
  // link to the substitute operating day's page
  const isDisabled = !vehicleScheduleFrameId;
  const hoverStyle = `${commonHoverStyle} hover:bg-light-grey`;
  return (
    <Row
      testId={testIds.container}
      className={`items-center space-x-4 text-center text-sm text-hsl-dark-80 ${className}`}
    >
      <IconButton
        tooltip={t('accessibility:timetables.changeValidityPeriod', {
          dayType: getLocalizedTextFromDbBlob(dayTypeNameI18n),
        })}
        className={`mr-2 h-8 w-16 rounded-sm border border-light-grey bg-white text-base ${
          isDisabled ? 'text-light-grey' : hoverStyle
        }`}
        disabled={isDisabled}
        onClick={changeVehicleScheduleFrameValidity}
        icon={<i className="icon-calendar" aria-hidden />}
        testId={testIds.changeValidityButton}
      />
      <span data-testid={testIds.validityTimeRange}>
        {`${mapToShortDate(validityStart)} - ${mapToShortDate(validityEnd)}`}
      </span>
      {hasTimetables && (
        <>
          <span>|</span>
          <span className="font-bold" data-testid={testIds.tripCount}>
            {t('timetables.tripCount', { count: tripCount })}
          </span>
          <span>|</span>
          <span data-testid={testIds.tripTimeRange}>
            {`${mapDurationToShortTime(
              firstTrip.start_time,
            )} ... ${mapDurationToShortTime(lastTrip.start_time)}`}
          </span>
        </>
      )}
    </Row>
  );
};
