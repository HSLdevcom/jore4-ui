import { padToTwoDigits } from '../../../../time';

export interface VehicleServiceRowData {
  hours: number;
  minutes: number[];
}

interface Props {
  data: VehicleServiceRowData;
  oddRowColor: string;
}

export const VehicleServiceTableRow = ({
  data,
  oddRowColor = '',
}: Props): JSX.Element => {
  const { hours, minutes } = data;
  return (
    <tr className={`flex items-stretch odd:${oddRowColor}`}>
      <td className="px-4">
        <h4>{padToTwoDigits(hours)}</h4>
      </td>
      <td className="flex flex-wrap content-center gap-x-3 border-l border-dark-grey pl-3 text-sm">
        {minutes.map((item, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={`${item}-${key}`}>{padToTwoDigits(item)}</span>
        ))}
      </td>
    </tr>
  );
};
