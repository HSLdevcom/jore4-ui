import orderBy from 'lodash/orderBy';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { VehicleJourneyWithServiceFragment } from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Row } from '../../../layoutComponents';
import { openChangeTimetableValidityModalAction } from '../../../redux';
import { mapDurationToShortTime, mapToShortDate } from '../../../time';
import { IconButton } from '../../../uiComponents';

const testIds = {
  container: 'VehicleJourneyGroupInfo',
  changeValidityButton: 'VehicleJourneyGroupInfo::changeValidityButton',
  validityTimeRange: 'VehicleJourneyGroupInfo::validityTimeRange',
  tripCount: 'VehicleJourneyGroupInfo::tripCount',
  tripTimeRange: 'VehicleJourneyGroupInfo::tripTimeRange',
};

export type VehicleJourneyGroupInfoProps = {
  readonly vehicleScheduleFrameId: UUID | null | undefined;
  readonly vehicleJourneys: ReadonlyArray<
    Pick<VehicleJourneyWithServiceFragment, 'start_time'>
  > | null;
  readonly validityStart: DateTime;
  readonly validityEnd: DateTime;
  readonly dayTypeNameI18n: LocalizedString;
  readonly className?: string;
};

/**
 * Displays common information about vehicle journey group, including its validity,
 * number of trips and first and last trip
 */
export const VehicleJourneyGroupInfo: FC<VehicleJourneyGroupInfoProps> = ({
  vehicleScheduleFrameId,
  vehicleJourneys,
  validityStart,
  validityEnd,
  dayTypeNameI18n,
  className,
}) => {
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

  return (
    <Row
      testId={testIds.container}
      className={twMerge(
        'items-center gap-4 text-center text-sm text-hsl-dark-80',
        className,
      )}
    >
      <IconButton
        tooltip={t('accessibility:timetables.changeValidityPeriod', {
          dayType: getLocalizedTextFromDbBlob(dayTypeNameI18n),
        })}
        className={twMerge(
          'mr-2 h-8 w-16 rounded-xs border border-light-grey bg-white text-base',
          'disabled:text-light-grey',
          'enabled:hover:border-tweaked-brand enabled:hover:bg-light-grey enabled:hover:outline-tweaked-brand',
        )}
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
