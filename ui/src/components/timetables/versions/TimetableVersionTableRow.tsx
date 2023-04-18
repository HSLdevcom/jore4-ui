import { useTranslation } from 'react-i18next';
import {
  DayOfWeek,
  TimetableVersionRowData,
} from '../../../hooks/useGetTimetableVersions';
import { mapTimetablePriorityToUiName } from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { mapToShortDate } from '../../../time';
import { TimetablePriority } from '../../../types/enums';

const getStatusClassName = ({
  priority,
  inEffect,
}: {
  priority: TimetablePriority;
  inEffect?: boolean;
}) => {
  if (inEffect) {
    return 'bg-hsl-dark-green text-white';
  }
  const statusClassNames: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-brand text-white',
    [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow',
    [TimetablePriority.Special]: 'bg-hsl-light-purple',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return statusClassNames[priority];
};

const DayOfWeekText: Record<DayOfWeek, string> = {
  [DayOfWeek.Monday]: 'maanantai',
  [DayOfWeek.Tuesday]: 'tiistai',
  [DayOfWeek.Wednesday]: 'keskiviikko',
  [DayOfWeek.Thursday]: 'torstai',
  [DayOfWeek.Friday]: 'perjantai',
  [DayOfWeek.Saturday]: 'lauantai',
  [DayOfWeek.Sunday]: 'sunnuntai',
};

interface Props {
  data: TimetableVersionRowData;
}

export const TimetableVersionTableRow = ({ data }: Props): JSX.Element => {
  const { t } = useTranslation();

  const statusClassName = ` ${getStatusClassName({
    priority: data.vehicleScheduleFrame.priority,
    inEffect: data.inEffect,
  })}`;

  const statusText = data.inEffect
    ? t('timetables.inEffect')
    : mapTimetablePriorityToUiName(data.vehicleScheduleFrame.priority);

  // TODO: After we get special days implemented, we need to determine this className
  // depending on wheter the row is from vehicleService or from special day.
  // The className for special days is: 'bg-city-bicycle-yellow bg-opacity-25'
  const dayTypeClassName = `bg-hsl-dark-green bg-opacity-25 ${
    data.substituteDay.substituteDayOfWeek ? 'py-2' : 'p-4'
  }`;

  return (
    <tr className="text-center [&>td]:border [&>td]:border-light-grey">
      <td className={statusClassName}>{statusText}</td>
      <td className={dayTypeClassName}>
        <span>{parseI18nField(data.dayType.nameI18n)}</span>
        {data.substituteDay.substituteDayOfWeek && (
          <span className="flex justify-center whitespace-nowrap text-xs">
            {t('timetables.operatedLike', {
              dayOfWeek: DayOfWeekText[data.substituteDay.substituteDayOfWeek],
            })}
          </span>
        )}
      </td>
      <td>{mapToShortDate(data.vehicleScheduleFrame.validityStart)}</td>
      <td>{mapToShortDate(data.vehicleScheduleFrame.validityEnd)}</td>
      <td>{data.routeLabelAndVariant}</td>
      <td>{parseI18nField(data.vehicleScheduleFrame.nameI18n)}</td>
      <td>!Muokkaaja</td>
      <td>!Muokattu</td>
      <td>...</td>
    </tr>
  );
};
