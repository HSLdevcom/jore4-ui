import { FC } from 'react';

/**
 * Simulates a bottom border on the ChangeHistoryTable.
 *
 * Borders are difficult on tables and work differently from other borders.
 * Due to having used borders to simulate margins inside the table, we cannot
 * use a simple "border-b-light-grey" on the <table> element, as that would/could
 * get assimilated into another elements border, casing it to not get rendered.
 *
 * Instead of using a height class do give width the border, we need to use a
 * padding as height can be assimilated into the border. Padding ensures we get
 * that 1 pixel of height truly.
 *
 * Only render if this is the last element in the table.
 *
 * @constructor
 */
export const OptionalSimulatedEndOfTableBorder: FC = () => (
  <tr aria-hidden className="bg-light-grey not-last:hidden">
    <td className="pt-[1px]" colSpan={7}>
      {null}
    </td>
  </tr>
);
