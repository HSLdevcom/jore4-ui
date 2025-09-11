import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../../hooks';
import {
  mapDayOfWeekToUiName,
  mapTimetablePriorityToUiName,
} from '../../../i18n/uiNameMappings';
import { useGetLocalizedTextFromDbBlob } from '../../../i18n/utils';
import { Visible } from '../../../layoutComponents';
import {
  openDeleteTimetableModalAction,
  openVersionPanelAction,
} from '../../../redux';
import { mapToShortDate } from '../../../time';
import { TimetablePriority } from '../../../types/enums';
import {
  AlignDirection,
  IconButton,
  SimpleDropdownMenu,
  SimpleDropdownMenuItem,
} from '../../../uiComponents';
import { TimetableVersionRowData } from './hooks';

const testIds = {
  row: 'TimetableVersionTableRow::row',
  dayType: 'TimetableVersionTableRow::dayType',
  validityStart: 'TimetableVersionTableRow::validityStart',
  validityEnd: 'TimetableVersionTableRow::validityEnd',
  actions: 'TimetableVersionTableRow::actions',
  deleteTimetableMenuItem: 'TimetableVersionTableRow::deleteTimetableMenuItem',
  versionPanelMenuItem: 'TimetableVersionTableRow::versionPanelMenuItem',
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
    [TimetablePriority.Special]: 'bg-border-hsl-commuter-train-purple', // Background purple would be too light in this context.
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
    [TimetablePriority.Special]: 'bg-border-hsl-commuter-train-purple',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return dayTypeClassNames[priority];
};

type TimetableVersionTableRowProps = {
  readonly data: TimetableVersionRowData;
};

export const TimetableVersionTableRow: FC<TimetableVersionTableRowProps> = ({
  data,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const dispatch = useAppDispatch();

  const onClick = () => {
    if (data.vehicleScheduleFrame.id) {
      dispatch(openDeleteTimetableModalAction(data.vehicleScheduleFrame.id));
    }
  };

  const openVersionPanel = () => {
    if (data.vehicleScheduleFrame.id) {
      dispatch(
        openVersionPanelAction({
          vehicleScheduleFrameId: data.vehicleScheduleFrame.id,
        }),
      );
    }
  };

  const statusClassName = ` ${getStatusClassName({
    priority: data.vehicleScheduleFrame.priority,
    inEffect: data.inEffect,
  })}`;

  const statusText = data.inEffect
    ? t('timetables.inEffect')
    : mapTimetablePriorityToUiName(t, data.vehicleScheduleFrame.priority);

  const substituteDayOperatingText = data.substituteDay?.substituteDayOfWeek
    ? t('timetables.operatedLike', {
        dayOfWeek: mapDayOfWeekToUiName(
          t,
          data.substituteDay.substituteDayOfWeek,
        ),
      })
    : t('timetables.noService');

  const dayTypeClassName = `${getDayTypeClassName(
    data.vehicleScheduleFrame.priority,
  )} bg-opacity-25`;

  const dayType = getLocalizedTextFromDbBlob(data.dayType.nameI18n);
  const vehicleScheduleFrameName = getLocalizedTextFromDbBlob(
    data.vehicleScheduleFrame.nameI18n,
  );

  return (
    <tr
      className="h-14 text-center [&>td]:border [&>td]:border-light-grey"
      data-testid={testIds.row}
    >
      <td className={statusClassName}>{statusText}</td>
      <td className={dayTypeClassName} data-testid={testIds.dayType}>
        {dayType}
        <Visible visible={!!data.vehicleScheduleFrame.id}>
          <IconButton
            onClick={openVersionPanel}
            tooltip={t('accessibility:timetables.showTimetable')}
            icon={<i className="icon-calendar" />}
          />
        </Visible>
        {data.substituteDay?.supersededDate && (
          <span className="flex justify-center whitespace-nowrap text-xs">
            {substituteDayOperatingText}
          </span>
        )}
      </td>
      <td data-testid={testIds.validityStart}>
        {mapToShortDate(data.vehicleScheduleFrame.validityStart)}
      </td>
      <td data-testid={testIds.validityEnd}>
        {mapToShortDate(data.vehicleScheduleFrame.validityEnd)}
      </td>
      <td>{data.routeLabelAndVariant}</td>
      <td>{vehicleScheduleFrameName}</td>
      <td>!Muokkaaja</td>
      <td>!Muokattu</td>
      <td>
        <Visible visible={!!data.vehicleScheduleFrame.id}>
          <SimpleDropdownMenu
            alignItems={AlignDirection.Right}
            testId={testIds.actions}
            tooltip={t('accessibility:timetables.versionActions', {
              status: statusText,
              schedule: vehicleScheduleFrameName,
              dayType,
            })}
          >
            <SimpleDropdownMenuItem
              onClick={onClick}
              testId={testIds.deleteTimetableMenuItem}
              text={t('timetables.versions.deleteTimetable')}
            />
            <SimpleDropdownMenuItem
              onClick={openVersionPanel}
              testId={testIds.versionPanelMenuItem}
              text={t('timetables.versions.showInfo')}
            />
          </SimpleDropdownMenu>
        </Visible>
      </td>
    </tr>
  );
};
