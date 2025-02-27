import { FC } from 'react';

type NoVersionRowProps = { noVersionsText: string };

export const NoVersionRow: FC<NoVersionRowProps> = ({ noVersionsText }) => {
  return (
    <tr>
      <td className="border px-4 py-2 text-center font-bold" colSpan={9}>
        {noVersionsText}
      </td>
    </tr>
  );
};
