import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import { groupBy, pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  VehicleJourneyWithServiceFragment,
} from '../../../../generated/graphql';
import { parseI18nField } from '../../../../i18n/utils';
import { Column, Row, Visible } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import {
  VehicleServiceRowData,
  VehicleServiceTableRow,
} from './VehicleServiceTableRow';

interface Props {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  vehicleJourneys: VehicleJourneyWithServiceFragment[];
  onClick: () => void;
}

const testIds = {
  timetable: 'Timetable::table',
};

export const getTimetableHeadingBgColor = (key: TimetablePriority) => {
  const bgColors: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: 'bg-hsl-dark-green',
    [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow',
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
    [TimetablePriority.Special]: 'bg-hsl-neutral-blue',
    [TimetablePriority.Draft]: 'bg-background',
    [TimetablePriority.Staging]: 'bg-hsl-neutral-blue',
  };
  return bgColors[key];
};

export const VehicleServiceTable = ({
  priority,
  dayType,
  vehicleJourneys,
  onClick,
}: Props): JSX.Element => {
  const { t } = useTranslation();

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
    <div onClick={onClick} onKeyPress={onKeyPress} role="button" tabIndex={0}>
      <Row
        className={`mb-4 rounded-md !bg-opacity-50 px-4 py-1 text-hsl-dark-80 ${getTimetableHeadingBgColor(
          priority,
        )}`}
      >
        <Column className="mr-auto">
          <h4>{parseI18nField(dayType.name_i18n)}</h4>
        </Column>
        <Column className="justify-center">
          <p className="text-sm">
            !{mapToShortDateTime(new Date().toISOString())}
            <MdHistory className="ml-2 inline" />
          </p>
        </Column>
      </Row>

      <Visible visible={hasVehicleJourneys}>
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
      </Visible>
      <Visible visible={!hasVehicleJourneys}>
        <p>{t('timetables.noService')}</p>
      </Visible>
    </div>
  );
};
