import groupBy from 'lodash/groupBy';
import { FC, KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHistory } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { Column, Visible } from '../../../../layoutComponents';
import { mapToShortDateTime } from '../../../../time';
import { TimetablePriority } from '../../../../types/enums';
import { VehicleJourneyGroupInfo } from '../../common/VehicleJourneyGroupInfo';
import { VehicleJourneyGroup } from '../useGetRouteTimetables';
import { VehicleServiceRow, VehicleServiceRowData } from './VehicleServiceRow';

type VehicleServiceTableProps = {
  readonly vehicleJourneyGroup: VehicleJourneyGroup;
  readonly onClick: () => void;
};

const testIds = {
  timetableHeadingButton: 'VehicleServiceTable::headingButton',
  timetable: 'VehicleServiceTable::table',
  vehicleServiceTable: (dayType: string) => `VehicleServiceTable::${dayType}`,
};

const headingBgColors: Readonly<Record<TimetablePriority, string>> = {
  [TimetablePriority.Standard]: 'bg-hsl-dark-green/50',
  [TimetablePriority.Temporary]: 'bg-city-bicycle-yellow/50',
  [TimetablePriority.SubstituteByLineType]: 'bg-hsl-orange/50',
  [TimetablePriority.Special]: 'bg-hsl-light-purple/50',
  [TimetablePriority.Draft]: 'bg-background/50',
  [TimetablePriority.Staging]: 'bg-hsl-red/50',
};

export const getTimetableHeadingBgColor = (key: TimetablePriority) =>
  headingBgColors[key];

const oddRowBgColors: Readonly<Record<TimetablePriority, string>> = {
  [TimetablePriority.Standard]: 'bg-hsl-neutral-blue',
  [TimetablePriority.Temporary]: 'bg-hsl-neutral-blue',
  [TimetablePriority.SubstituteByLineType]: 'bg-hsl-neutral-blue',
  [TimetablePriority.Special]: 'bg-hsl-neutral-blue',
  [TimetablePriority.Draft]: 'bg-background',
  [TimetablePriority.Staging]: 'bg-hsl-neutral-blue',
};
const getOddRowColor = (key: TimetablePriority) => oddRowBgColors[key];

export const VehicleServiceTable: FC<VehicleServiceTableProps> = ({
  vehicleJourneyGroup,
  onClick,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const { vehicleJourneys, priority, dayType, createdAt } = vehicleJourneyGroup;

  const sortedDepartureTimes =
    vehicleJourneys
      ?.flatMap((item) => item.start_time)
      .sort(
        (time1, time2) => time1.as('millisecond') - time2.as('millisecond'),
      ) ?? [];

  const departureTimesByHour = groupBy(
    sortedDepartureTimes,
    (item) => item.hours,
  );

  const rowData: VehicleServiceRowData[] = Object.entries(
    departureTimesByHour,
  ).map(([key, value]) => ({
    hours: Number(key),
    minutes: value.map((item) => item.minutes),
  }));

  const hasVehicleJourneys = !!rowData.length;

  const onKeyPress: KeyboardEventHandler = (e) => {
    if (e.code === 'Enter') {
      onClick();
    }
  };

  return (
    <div
      className="space-y-2"
      data-testid={testIds.vehicleServiceTable(dayType.label)}
    >
      <div
        className={twMerge(
          'flex flex-row rounded-md border-2 border-transparent px-4 py-1 hover:border-gray-500',
          getTimetableHeadingBgColor(priority),
        )}
        onClick={onClick}
        // TODO: Replace with key down or up, or should this just be replaced with button component?
        onKeyPress={onKeyPress}
        role="button"
        tabIndex={0}
        data-testid={testIds.timetableHeadingButton}
      >
        <Column className="mr-auto">
          <h4>{getLocalizedTextFromDbBlob(dayType.name_i18n)}</h4>
        </Column>
        <Column className="justify-center">
          <p className="text-sm">
            {mapToShortDateTime(createdAt)}
            <MdHistory className="ml-2 inline" />
          </p>
        </Column>
      </div>
      <VehicleJourneyGroupInfo
        vehicleJourneys={vehicleJourneyGroup.vehicleJourneys}
        validityStart={vehicleJourneyGroup.validity.validityStart}
        validityEnd={vehicleJourneyGroup.validity.validityEnd}
        vehicleScheduleFrameId={vehicleJourneyGroup.vehicleScheduleFrameId}
        dayTypeNameI18n={vehicleJourneyGroup.dayType.name_i18n}
        className="space-x-2"
      />
      <Visible visible={hasVehicleJourneys}>
        <div
          onClick={onClick}
          onKeyPress={onKeyPress}
          role="button"
          title="Click to view passing times by stop"
          tabIndex={0}
          data-testid={testIds.timetable}
          className="border-2 border-hsl-neutral-blue hover:border-gray-500"
        >
          {rowData.map((item) => (
            <VehicleServiceRow
              key={item.hours}
              data={item}
              oddRowColor={getOddRowColor(priority)}
            />
          ))}
        </div>
      </Visible>
      <Visible visible={!hasVehicleJourneys}>
        <p className="text-center">{t('timetables.noTraffic')}</p>
      </Visible>
    </div>
  );
};
