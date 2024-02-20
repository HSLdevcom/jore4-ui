import { Row } from '../../../../layoutComponents';
import { padToTwoDigits } from '../../../../time';

export interface VehicleServiceRowData {
  hours: number;
  minutes: number[];
}

interface Props {
  data: VehicleServiceRowData;
  oddRowColor?: string;
}

export const VehicleServiceRow = ({
  data,
  oddRowColor = 'bg-hsl-neutral-blue',
}: Props) => {
  const { hours, minutes } = data;
  return (
    <Row className={`items-center gap-x-3 odd:${oddRowColor}`}>
      {/* TODO: Maybe we can get monospaced arial in the future */}
      <span
        className="border-r border-dark-grey px-4 font-mono text-lg font-bold "
        aria-label={`The departure minutes for the hour ${hours} are as follows:`}
      >
        {padToTwoDigits(hours)}
      </span>
      {minutes.map((item, key) => (
        <span
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
