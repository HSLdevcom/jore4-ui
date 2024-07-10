import { useTranslation } from 'react-i18next';
import { pipe, uniq } from 'remeda';
import { RouteWithJourneyPatternStopsFragment } from '../../../generated/graphql';
import { VehicleJourneyGroup, useTimetablesViewState } from '../../../hooks';
import { parseI18nField } from '../../../i18n/utils';
import { Row } from '../../../layoutComponents';
import { TimetablePriority } from '../../../types/enums';
import { VehicleJourneyGroupInfo } from '../common/VehicleJourneyGroupInfo';
import { getTimetableHeadingBgColor } from '../vehicle-schedule-details/vehicle-service-table/VehicleServiceTable';
import { DayTypeDropdown } from './DayTypeDropdown';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';

const testIds = {
  passingTimesByStopSection: (dayType: string, priority: TimetablePriority) =>
    `PassingTimesByStopSection::${dayType}::${priority}`,
};

type Props = {
  vehicleJourneyGroups: VehicleJourneyGroup[];
  route: RouteWithJourneyPatternStopsFragment;
};

/**
 * Displays vehicle passing times by stops for each day type / priority combination
 * that are valid during selected observation date.
 */
export const PassingTimesByStopSection = ({
  vehicleJourneyGroups,
  route,
}: Props): JSX.Element => {
  const { dayType, setDayType } = useTimetablesViewState();
  const { t } = useTranslation();

  const vehicleJourneyGroupsToDisplay =
    vehicleJourneyGroups?.filter(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType.label === dayType,
    ) ?? [];

  const dayTypes = pipe(
    vehicleJourneyGroups.map(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType,
    ),
    (types) => uniq(types),
  );

  const dayTypeUiNameMapper = (dayTypeLabel: string) => {
    return pipe(
      dayTypes.find((type) => type.label === dayTypeLabel),
      (type) => type?.name_i18n,
      parseI18nField,
    );
  };

  if (!dayType) {
    return <></>;
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
