import uniq from 'lodash/uniq';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithJourneyPatternStopsFragment } from '../../../generated/graphql';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Row } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { VehicleJourneyGroupInfo } from '../common/VehicleJourneyGroupInfo';
import { getTimetableHeadingBgColor } from '../vehicle-schedule-details/vehicle-service-table/VehicleServiceTable';
import { DayTypeDropdown } from './DayTypeDropdown';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';
import { useTimetablesViewState } from '../common/useTimetablesViewState';
import { VehicleJourneyGroup } from '../vehicle-schedule-details/useGetRouteTimetables';

const testIds = {
  passingTimesByStopSection: (dayType: string, priority: TimetablePriority) =>
    `PassingTimesByStopSection::${dayType}::${priority}`,
};

type PassingTimesByStopSectionProps = {
  readonly vehicleJourneyGroups: ReadonlyArray<VehicleJourneyGroup>;
  readonly route: RouteWithJourneyPatternStopsFragment;
};

/**
 * Displays vehicle passing times by stops for each day type / priority combination
 * that are valid during selected observation date.
 */
export const PassingTimesByStopSection: FC<PassingTimesByStopSectionProps> = ({
  vehicleJourneyGroups,
  route,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const { dayType, setDayType } = useTimetablesViewState();

  const vehicleJourneyGroupsToDisplay =
    vehicleJourneyGroups?.filter(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType.label === dayType,
    ) ?? [];

  const dayTypes = uniq(
    vehicleJourneyGroups.map(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType,
    ),
  );

  const dayTypeUiNameMapper = (dayTypeLabel: string) => {
    const name = dayTypes.find(
      (type) => type.label === dayTypeLabel,
    )?.name_i18n;
    return getLocalizedTextFromDbBlob(name);
  };

  if (!dayType) {
    return null;
  }

  return (
    <div className="space-y-10">
      {vehicleJourneyGroupsToDisplay.map((vehicleJourneyGroup) => (
        <div
          className="space-y-6"
          key={`${dayType}${vehicleJourneyGroup.priority}`}
          data-testid={testIds.passingTimesByStopSection(
            dayType,
            vehicleJourneyGroup.priority,
          )}
        >
          <Row className="items-center space-x-4">
            <div className="min-w-[240px]">
              <DayTypeDropdown
                values={dayTypes.map((type) => type.label)}
                value={dayType}
                onChange={(e) => setDayType(e.target.value)}
                uiNameMapper={dayTypeUiNameMapper}
                buttonClassNames={`text-black !bg-opacity-50 ${getTimetableHeadingBgColor(
                  vehicleJourneyGroup.priority,
                )}`}
              />
            </div>
            <VehicleJourneyGroupInfo
              vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
              vehicleScheduleFrameId={
                vehicleJourneyGroup.vehicleScheduleFrameId
              }
              validityStart={vehicleJourneyGroup.validity.validityStart}
              validityEnd={vehicleJourneyGroup.validity.validityEnd}
              dayTypeNameI18n={vehicleJourneyGroup.dayType.name_i18n}
            />
          </Row>
          {vehicleJourneyGroup.vehicleJourneys ? (
            <PassingTimesByStopTable
              vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
              route={route}
            />
          ) : (
            <span className="flex justify-center">
              {t('timetables.noTraffic')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
