import { useTranslation } from 'react-i18next';
import { pipe, uniq } from 'remeda';
import { VehicleJourneyGroup, useTimetablesViewState } from '../../../hooks';
import { mapTimetablePriorityToUiName } from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { mapToShortDate } from '../../../time';
import { getTimetableHeadingBgColor } from '../vehicle-schedule-details/vehicle-service-table/VehicleServiceTable';
import { DayTypeDropdown } from './DayTypeDropdown';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';

type Props = {
  vehicleJourneyGroups: VehicleJourneyGroup[];
};

/**
 * Displays vehicle passing times by stops for each day type / priority combination
 * that are valid during selected observation date.
 */
export const PassingTimesByStopSection = ({
  vehicleJourneyGroups,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { dayType, setDayType } = useTimetablesViewState();

  const vehicleJourneyGroupsToDisplay =
    vehicleJourneyGroups?.filter(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType.label === dayType,
    ) || [];

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
          key={`${vehicleJourneyGroup.dayType}${vehicleJourneyGroup.priority}`}
        >
          <div className="w-64">
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
          {/* TODO: Implement properly with day type picker etc. */}
          {parseI18nField(vehicleJourneyGroup.dayType.name_i18n)}
          {': '}
          {t('timetables.timetableValidity', {
            validityStart: mapToShortDate(
              vehicleJourneyGroup.validity.validityStart,
            ),
            validityEnd: mapToShortDate(
              vehicleJourneyGroup.validity.validityEnd,
            ),
          })}
          {` (${mapTimetablePriorityToUiName(vehicleJourneyGroup.priority)})`}
          <PassingTimesByStopTable
            vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
          />
        </div>
      ))}
    </div>
  );
};
