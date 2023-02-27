import { useTranslation } from 'react-i18next';
import { VehicleJourneyGroup, useTimetablesViewState } from '../../../hooks';
import { mapTimetablePriorityToUiName } from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { mapToShortDate } from '../../../time';
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

  const { dayType } = useTimetablesViewState();

  const vehicleJourneyGroupsToDisplay =
    vehicleJourneyGroups?.filter(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType.label === dayType,
    ) || [];

  return (
    <div className="space-y-10">
      {vehicleJourneyGroupsToDisplay.map((vehicleJourneyGroup) => (
        <div
          key={`${vehicleJourneyGroup.dayType}${vehicleJourneyGroup.priority}`}
        >
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
