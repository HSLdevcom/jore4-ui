import { useTranslation } from 'react-i18next';
import { TimetableWithMetadata, useTimetablesViewState } from '../../../hooks';
import { mapTimetablePriorityToUiName } from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { mapToShortDate } from '../../../time';
import { PassingTimesByStopTable } from './PassingTimesByStopTable';

type Props = {
  timetables: TimetableWithMetadata;
};

export const PassingTimesByStopSection = ({
  timetables,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { dayType } = useTimetablesViewState();

  const { validityStart, validityEnd } = timetables?.validity || {};

  const vehicleJourneyGroupsToDisplay =
    timetables?.vehicleJourneyGroups?.filter(
      (vehicleJourneyGroup) => vehicleJourneyGroup.dayType.label === dayType,
    ) || [];

  return (
    <div className="space-y-10">
      {vehicleJourneyGroupsToDisplay.map((vehicleJourneyGroup) => (
        <div
          key={`${vehicleJourneyGroup.dayType}${vehicleJourneyGroup.dayType}`}
        >
          {/* Implement properly with day type picker etc. */}
          {parseI18nField(vehicleJourneyGroup.dayType.name_i18n)}
          {': '}
          {t('timetables.timetableValidity', {
            validityStart: mapToShortDate(validityStart),
            validityEnd: mapToShortDate(validityEnd),
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
