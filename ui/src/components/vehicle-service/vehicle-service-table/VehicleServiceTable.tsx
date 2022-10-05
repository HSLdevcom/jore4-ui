import { Column, Row } from '../../../layoutComponents';
import { mapToShortDateTime } from '../../../time';
import {
  MockVehicleServiceRowData,
  VehicleServiceTableRow,
} from './VehicleServiceTableRow';

interface Props {
  className?: string;
}

const testIds = {
  timetable: 'Timetable::table',
};

export const VehicleServiceTable = ({ className = '' }: Props): JSX.Element => {
  const mockContent: MockVehicleServiceRowData[] = [
    { hours: 1, minutes: [1, 3, 5] },
    { hours: 2, minutes: [1, 3, 5, 7, 9] },
    { hours: 3, minutes: [1, 3, 5, 7, 9] },
    { hours: 3, minutes: [1, 3, 5, 7, 9, 12, 15, 18, 23] },
    { hours: 4, minutes: [1] },
  ];

  return (
    <div>
      <Row className="mb-4 rounded-md bg-hsl-dark-green bg-opacity-50 px-4 py-1">
        <Column className="mr-auto">
          <h4>!Ma-To</h4>
        </Column>
        <Column className="justify-center">
          <p className="text-sm text-hsl-dark-80">
            !{mapToShortDateTime(new Date().toISOString())}
          </p>
        </Column>
      </Row>

      <table className={`${className}`} data-testid={testIds.timetable}>
        {mockContent.map((item) => (
          <VehicleServiceTableRow key={item.hours} data={item} />
        ))}
      </table>
    </div>
  );
};
