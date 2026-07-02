import { FC } from 'react';

type NoVersionRowProps = {
  readonly noVersionsText: string;
  readonly colSpan: number;
};

export const NoVersionRow: FC<NoVersionRowProps> = ({
  noVersionsText,
  colSpan,
}) => {
  return (
    <tr>
      <td className="border px-4 py-2 text-center font-bold" colSpan={colSpan}>
        {noVersionsText}
      </td>
    </tr>
  );
};
