import { padToTwoDigits } from '../../../../time';

interface Props {
  data: VehicleServiceRowData;
}

export interface VehicleServiceRowData {
  hours: number;
  minutes: number[];
}

export const VehicleServiceTableRow = ({ data }: Props): JSX.Element => {
  const { hours, minutes } = data;
  return (
    <tr className="odd:bg-hsl-neutral-blue">
      <td className="border-r border-dark-grey px-4">
        <h4>{padToTwoDigits(hours)}</h4>
      </td>
      <td className="w-full space-x-3 pl-3 text-sm">
        {minutes.map((item) => (
          <span key={item}>{padToTwoDigits(item)}</span>
        ))}
      </td>
    </tr>
  );
};
