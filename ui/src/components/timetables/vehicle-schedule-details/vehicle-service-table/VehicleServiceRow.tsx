import { Row } from '../../../../layoutComponents';
import { padToTwoDigits } from '../../../../time';

export interface VehicleServiceRowData {
  hours: number;
  minutes: ReadonlyArray<number>;
}

interface Props {
  data: VehicleServiceRowData;
  oddRowColor?: string;
}

const testIds = {
  row: 'VehicleServiceRow::row',
  hour: 'VehicleServiceRow::hour',
  minute: 'VehicleServiceRow::minute',
};

export const VehicleServiceRow = ({
  data,
  oddRowColor = 'bg-hsl-neutral-blue',
}: Props) => {
  const { hours, minutes } = data;
  return (
    <Row
      testId={testIds.row}
      className={`items-center gap-x-3 odd:${oddRowColor}`}
    >
      {/* TODO: Maybe we can get monospaced arial in the future */}
      <span
        data-testid={testIds.hour}
        className="border-r border-dark-grey px-4 font-mono text-lg font-bold"
        aria-label={`The departure minutes for the hour ${hours} are as follows:`}
      >
        {padToTwoDigits(hours)}
      </span>
      {minutes.map((item, key) => (
        <span
          data-testid={testIds.minute}
          className="text-sm"
          aria-label={`${item},`}
          // eslint-disable-next-line react/no-array-index-key
          key={`${item}-${key}`}
        >
          {padToTwoDigits(item)}
        </span>
      ))}
    </Row>
  );
};
