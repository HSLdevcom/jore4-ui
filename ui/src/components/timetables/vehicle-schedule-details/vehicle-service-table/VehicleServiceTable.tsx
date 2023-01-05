import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import { groupBy, pipe } from 'remeda';
import {
  DayTypeAllFieldsFragment,
  VehicleServiceWithJourneysFragment,
} from '../../../../generated/graphql';
import { parseI18nField } from '../../../../i18n/utils';
import { Column, Row, Visible } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/Priority';
import {
  VehicleServiceRowData,
  VehicleServiceTableRow,
} from './VehicleServiceTableRow';

interface Props {
  priority: TimetablePriority;
  dayType: DayTypeAllFieldsFragment;
  vehicleServices: VehicleServiceWithJourneysFragment[];
}

const testIds = {
  timetable: 'Timetable::table',
};

export const VehicleServiceTable = ({
  priority,
  dayType,
  vehicleServices,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const getHeadingBgColor = (key: TimetablePriority) => {
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

  const passingTimesByHour = pipe(
    vehicleServices,
    (services) => services.flatMap((item) => item.blocks),
    (blocks) => blocks.flatMap((item) => item.vehicle_journeys),
    (journeys) => journeys.flatMap((item) => item.start_time),
    (journeyStartTimes) =>
      journeyStartTimes.sort(
        (time1, time2) => time1.as('millisecond') - time2.as('millisecond'),
      ),
    (journeyStartTimes) => groupBy(journeyStartTimes, (item) => item.hours),
  );

  const rowData: VehicleServiceRowData[] = Object.entries(
    passingTimesByHour,
  ).map(([key, value]) => ({
    hours: Number(key),
    minutes: value.map((item) => item.minutes),
  }));

  const hasVehicleServices = !!rowData.length;

  return (
    <div>
      <Row
        className={`mb-4 rounded-md bg-opacity-50 px-4 py-1 text-hsl-dark-80 ${getHeadingBgColor(
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

      <Visible visible={hasVehicleServices}>
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
      <Visible visible={!hasVehicleServices}>
        <p>{t('timetables.noService')}</p>
      </Visible>
    </div>
  );
};
