interface Props {
  data: MockTimetableRowData;
}

export interface MockTimetableRowData {
  hours: number;
  minutes: number[];
}

export const TimetableRow = ({ data }: Props): JSX.Element => {
  const { hours, minutes } = data;
  return (
    <tr className="odd:bg-hsl-neutral-blue">
      <td className="border-r border-dark-grey px-4">
        <h4>0{hours}</h4>
      </td>
      <td className="w-full space-x-3 pl-3 text-sm">
        {minutes.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </td>
    </tr>
  );
};
