import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import { groupBy, pipe } from 'remeda';
import { twMerge } from 'tailwind-merge';
import { VehicleJourneyGroup } from '../../../../hooks';
import { parseI18nField } from '../../../../i18n/utils';
import { Column, Visible } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import { VehicleJourneyGroupInfo } from '../../common/VehicleJourneyGroupInfo';
import {
  VehicleServiceRowData,
  VehicleServiceTableRow,
} from './VehicleServiceTableRow';

interface Props {
  vehicleJourneyGroup: VehicleJourneyGroup;
  onClick: () => void;
}

const testIds = {
  timetable: 'VehicleServiceTable::table',
};

export const getTimetableHeadingBgColor = (key: TimetablePriority) => {
  const bgColors: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-hsl-dark-green',
    [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange',
    [TimetablePriority.Special]: 'bg-hsl-light-purple',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-red',
  };
  return bgColors[key];
};

const getOddRowColor = (key: TimetablePriority) => {
  const bgColors: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-hsl-neutral-blue',
    [TimetablePriority.Temporary]: 'bg-hsl-neutral-blue',
    [TimetablePriority.SubstituteByLineType]: 'bg-hsl-neutral-blue',
    [TimetablePriority.Special]: 'bg-hsl-neutral-blue',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-neutral-blue',
  };
  return bgColors[key];
};

export const VehicleServiceTable = ({
  vehicleJourneyGroup,
  onClick,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const { vehicleJourneys, priority, dayType, createdAt } = vehicleJourneyGroup;

  const departureTimesByHour = pipe(
    vehicleJourneys,
    (services) => services.flatMap((item) => item.start_time),
    (journeyStartTimes) =>
      journeyStartTimes.sort(
        (time1, time2) => time1.as('millisecond') - time2.as('millisecond'),
      ),
    (journeyStartTimes) => groupBy(journeyStartTimes, (item) => item.hours),
  );

  const rowData: VehicleServiceRowData[] = Object.entries(
    departureTimesByHour,
  ).map(([key, value]) => ({
    hours: Number(key),
    minutes: value.map((item) => item.minutes),
  }));

  const hasVehicleJourneys = !!rowData.length;

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      onClick();
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={twMerge(
          'flex flex-row rounded-md border-2 border-transparent bg-opacity-50 px-4 py-1 hover:border-gray-500',
          getTimetableHeadingBgColor(priority),
        )}
        onClick={onClick}
        onKeyPress={onKeyPress}
        role="button"
        tabIndex={0}
      >
        <Column className="mr-auto">
          <h4>{parseI18nField(dayType.name_i18n)}</h4>
        </Column>
        <Column className="justify-center">
          <p className="text-sm">
            {mapToShortDateTime(createdAt)}
            <MdHistory className="ml-2 inline" />
          </p>
        </Column>
      </div>
      <VehicleJourneyGroupInfo
        vehicleJourneyGroup={vehicleJourneyGroup}
        className="space-x-2"
      />
      <Visible visible={hasVehicleJourneys}>
        <div
          onClick={onClick}
          onKeyPress={onKeyPress}
          role="button"
          tabIndex={0}
          className="border-2 border-hsl-neutral-blue hover:border-gray-500"
        >
          <table data-testid={testIds.timetable} className="flex">
            <tbody className=" w-full">
              {rowData.map((item) => (
                <VehicleServiceTableRow
                  key={item.hours}
                  data={item}
                  oddRowColor={getOddRowColor(priority)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Visible>
      <Visible visible={!hasVehicleJourneys}>
        <p>{t('timetables.noSchedules')}</p>
      </Visible>
    </div>
  );
};
