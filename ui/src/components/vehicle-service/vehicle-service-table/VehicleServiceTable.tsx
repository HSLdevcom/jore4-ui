import { MdHistory } from 'react-icons/md';
import { groupBy, pipe } from 'remeda';
import { TimetablesVehicleServiceVehicleService } from '../../../generated/graphql';
import { Column, Row } from '../../../layoutComponents';
import { mapToShortDateTime } from '../../../time';
import {
  VehicleServiceRowData,
  VehicleServiceTableRow,
} from './VehicleServiceTableRow';

interface Props {
  heading: string;
  vehicleServices: TimetablesVehicleServiceVehicleService[];
}

const testIds = {
  timetable: 'Timetable::table',
};

export const VehicleServiceTable = ({
  heading,
  vehicleServices,
}: Props): JSX.Element => {
  const passingTimesByHour = pipe(
    vehicleServices,
    (services) => (services.length ? services[0].blocks : []),
    (blocks) => blocks.flatMap((item) => item.vehicle_journeys),
    (journeys) =>
      journeys.flatMap((journey) => journey.timetabled_passing_times),
    (timetabledPassingTimes) =>
      // Unsafe non-null assertion as datamodel should always have
      // departure_time defined(?)
      // TODO: set codegen to define departure_time as required field
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      groupBy(timetabledPassingTimes, (item) => item.departure_time!.hours),
  );

  const rowData: VehicleServiceRowData[] = Object.entries(
    passingTimesByHour,
  ).map(([key, value]) => ({
    hours: Number(key),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    minutes: value.map((item) => item.departure_time!.minutes),
  }));

  if (!rowData.length) {
    // Don't render table at all if we don't have any meaningful data to show.
    // TODO: probably this kind of situation should be already handled
    // when doing graphql query?
    return <></>;
  }

  return (
    <div>
      <Row className="mb-4 rounded-md bg-hsl-dark-green bg-opacity-50 px-4 py-1 text-hsl-dark-80">
        <Column className="mr-auto">
          <h4>{heading}</h4>
        </Column>
        <Column className="text- justify-center">
          <p className="text-sm">
            !{mapToShortDateTime(new Date().toISOString())}
            <MdHistory className="ml-2 inline" />
          </p>
        </Column>
      </Row>

      <table data-testid={testIds.timetable}>
        <tbody>
          {rowData.map((item) => (
            <VehicleServiceTableRow key={item.hours} data={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
