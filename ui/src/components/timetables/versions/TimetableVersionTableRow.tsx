import { useTranslation } from 'react-i18next';
import { TimetableVersionRowData } from '../../../hooks/useGetTimetableVersions';
import { useDeleteVehicleScheduleFrame } from '../../../hooks/vehicle-schedule-frame/useDeleteVehicleScheduleFrame';
import {
  mapDayOfWeekToUiName,
  mapTimetablePriorityToUiName,
} from '../../../i18n/uiNameMappings';
import { parseI18nField } from '../../../i18n/utils';
import { mapToShortDate } from '../../../time';
import { TimetablePriority } from '../../../types/enums';
import {
  AlignDirection,
  SimpleDropdownMenu,
  Spinner,
} from '../../../uiComponents';
import { SimpleDropdownMenuItem } from '../../routes-and-lines/line-details/SimpleDropdownMenuItem';

const testIds = {
  timetableVersionTableRow: 'TimetableVersionTableRow::row',
  deleteTimetableMenuItem: 'TimetableVersionTableRow::deleteTimetableMenuItem',
};

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
    [TimetablePriority.Special]: 'bg-hsl-purple',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return statusClassNames[priority];
};

const getDayTypeClassName = (priority: TimetablePriority) => {
  const dayTypeClassNames: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-hsl-dark-green',
    [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow',
    [TimetablePriority.Special]: 'bg-hsl-purple',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return dayTypeClassNames[priority];
};

interface Props {
  data: TimetableVersionRowData;
  fetchTimetableVersions: () => void;
  handleDialogOpen: (callback: () => void, id: string | undefined) => void;
}

export const TimetableVersionTableRow = ({
  data,
  fetchTimetableVersions,
  handleDialogOpen,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { deleteVehicleScheduleFrameMutation, loading } =
    useDeleteVehicleScheduleFrame({ onCompleted: fetchTimetableVersions });

  const statusClassName = ` ${getStatusClassName({
    priority: data.vehicleScheduleFrame.priority,
    inEffect: data.inEffect,
  })}`;

  const statusText = data.inEffect
    ? t('timetables.inEffect')
    : mapTimetablePriorityToUiName(data.vehicleScheduleFrame.priority);

  const substituteDayOperatingText = data.substituteDay?.substituteDayOfWeek
    ? t('timetables.operatedLike', {
        dayOfWeek: mapDayOfWeekToUiName(data.substituteDay.substituteDayOfWeek),
      })
    : t('timetables.noService');

  const dayTypeClassName = `${getDayTypeClassName(
    data.vehicleScheduleFrame.priority,
  )} bg-opacity-25`;

  const deleteVehicleScheduleFrame = async () => {
    if (data.vehicleScheduleFrame.id) {
      await deleteVehicleScheduleFrameMutation({
        vehicle_schedule_frame_id: data.vehicleScheduleFrame.id,
      });
    }
  };

  const handleDeleteTimetableClick = () => {
    // Set callback to be called when user confirms the deletion
    handleDialogOpen(
      () => deleteVehicleScheduleFrame,
      data.vehicleScheduleFrame.id,
    );
  };

  return (
    <tr
      className="h-14 text-center [&>td]:border [&>td]:border-light-grey"
      data-testid={testIds.timetableVersionTableRow}
    >
      <td className={statusClassName}>{statusText}</td>
      <td className={dayTypeClassName}>
        {parseI18nField(data.dayType.nameI18n)}
        {data.substituteDay?.supersededDate && (
          <span className="flex justify-center whitespace-nowrap text-xs">
            {substituteDayOperatingText}
          </span>
        )}
      </td>
      <td>{mapToShortDate(data.vehicleScheduleFrame.validityStart)}</td>
      <td>{mapToShortDate(data.vehicleScheduleFrame.validityEnd)}</td>
      <td>{data.routeLabelAndVariant}</td>
      <td>{parseI18nField(data.vehicleScheduleFrame.nameI18n)}</td>
      <td>!Muokkaaja</td>
      <td>!Muokattu</td>
      <td>
        {loading ? (
          <Spinner showSpinner />
        ) : (
          <SimpleDropdownMenu alignItems={AlignDirection.Right} testId="menu">
            <SimpleDropdownMenuItem
              disabled={!data.vehicleScheduleFrame.id}
              onClick={handleDeleteTimetableClick}
              testId={testIds.deleteTimetableMenuItem}
              text={t('timetables.versions.deleteTimetable')}
            />
          </SimpleDropdownMenu>
        )}
      </td>
    </tr>
  );
};
