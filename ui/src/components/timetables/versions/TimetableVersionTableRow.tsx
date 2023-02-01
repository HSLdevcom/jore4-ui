import { useTranslation } from 'react-i18next';
import { TimetablesVersionsRowData } from '../../../hooks';
import { mapTimetablePriorityToUiName } from '../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../time';
import { TimetablePriority } from '../../../types/Priority';

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
  switch (priority) {
    case TimetablePriority.Standard:
      return 'bg-brand text-white';
    case TimetablePriority.Temporary:
      return 'bg-city-bicycle-yellow';
    case TimetablePriority.Draft:
      return 'bg-gray-100';
    default:
      throw new Error(`Unkown priority: ${priority}`);
  }
};

const StatusTableDataCell = ({
  priority,
  inEffect,
}: {
  priority: TimetablePriority;
  inEffect?: boolean;
}) => {
  const statusClassName = getStatusClassName({
    priority,
    inEffect,
  });
  const { t } = useTranslation();
  // TODO: After we get special days implemented, we might need a rework for this
  return (
    <td className={statusClassName}>
      {inEffect
        ? t('timetables.inEffect')
        : mapTimetablePriorityToUiName(priority)}
    </td>
  );
};

export const TimetableVersionTableRow = ({
  data,
}: {
  data: TimetablesVersionsRowData;
}): JSX.Element => {
  // TODO: After we get special days implemented, we need to determine this className
  // depending on wheter the row is from vehicleService or from special day.
  // The className for special days is: 'bg-city-bicycle-yellow bg-opacity-25'
  const dayTypeClassName = 'bg-hsl-dark-green bg-opacity-25';

  return (
    <tr className="text-center [&>td]:border [&>td]:border-light-grey [&>td]:p-4">
      <StatusTableDataCell
        priority={data.vehicle_schedule_frame.priority}
        inEffect={data.inEffect}
      />
      <td className={dayTypeClassName}>{data.day_type.name_i18n.fi_FI}</td>
      <td>{mapToShortDate(data.vehicle_schedule_frame.validity_start)}</td>
      <td>{mapToShortDate(data.vehicle_schedule_frame.validity_end)}</td>
      <td>{data.routeLabelAndVariant}</td>
      <td>{data.vehicle_schedule_frame.name_i18n.fi_FI}</td>
      <td>!Muokkaaja</td>
      <td>!Muokattu</td>
      <td>...</td>
    </tr>
  );
};
