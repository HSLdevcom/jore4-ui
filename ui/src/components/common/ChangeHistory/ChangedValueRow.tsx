import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { ChangedValueCell } from './ChangedValueCell';
import { ChangedValue } from './types';

const testIds = {
  dataRow: (testId: string, field: string) =>
    `ChangeHistory::ChangedValues::${testId}::${field}`,
  name: 'ChangeHistory::ChangedValues::name',
  oldValue: 'ChangeHistory::ChangedValues::oldValue',
  newValue: 'ChangeHistory::ChangedValues::newValue',
};

const rowClassNames = twJoin(
  // On rows where the text flow onto multiple lines, make sure it stays at the
  // top, instead of getting centered.
  'align-top',

  //  Margin is simulated with a white border to match the page's background color.
  'border-white',

  // Add some extra top margin (simulated with border, because of tables)
  // to the 1st data row of a change group.
  'data-[location="first"]:border-t-[calc(var(--spacing)*5)]',

  // And same bottom margin to the last one.
  'data-[location="last"]:border-b-[calc(var(--spacing)*5)]',

  // If it is the only change, it needs to have the big margin on both sides.
  'data-[location="only"]:border-y-[calc(var(--spacing)*5)]',

  // Visualize odd-rows within a section differently to improve readablity.
  'data-[parity="odd"]:bg-background',
  'data-[parity="even"]:bg-background-hsl-pink-10',
);

type LocationInSection = 'first' | 'middle' | 'last' | 'only';
type ParityInSection = 'even' | 'odd';

export function getLocationByArrayIndex(
  arr: ReadonlyArray<unknown>,
  i: number,
): LocationInSection {
  if (arr.length === 1) {
    return 'only';
  }

  if (i === 0) {
    return 'first';
  }

  if (i === arr.length - 1) {
    return 'last';
  }

  return 'middle';
}

export function getParityByArrayIndex(i: number): ParityInSection {
  return i % 2 ? 'odd' : 'even';
}

type ChangedValueRowProps = {
  readonly location: LocationInSection;
  readonly parity: ParityInSection;
  readonly testId: string;
  readonly value: ChangedValue;
};

export const ChangedValueRow: FC<ChangedValueRowProps> = ({
  location,
  parity,
  testId,
  value: { key, field, oldValue, newValue },
}) => {
  return (
    <tr
      className={rowClassNames}
      data-location={location}
      data-parity={parity}
      data-testid={testIds.dataRow(testId, key ?? field)}
    >
      <td
        // Ensure we always get at least couple of words per line.
        // On big screens, prefer automatic min with, with the text completely
        // on one line.
        className="min-w-48 px-2 py-1 lg:min-w-68 xl:min-w-0 xl:pr-5 xl:text-nowrap"
        data-testid={testIds.name}
      >
        {field}
      </td>
      <ChangedValueCell
        // Ensure that long textual content gets at least couple of words per line.
        // If there is no long text on the table anywhere, rever to automatic
        // minimal size column as per the table's header row sizing rules.
        className="px-2 py-1 text-right data-[long]:min-w-68 xl:px-5"
        testId={testIds.oldValue}
        value={oldValue}
      />
      <ChangedValueCell
        // Same as old value, but here the table's header row sizing allocates
        // as much space to this row as can be allocated, minimizing others.
        className="px-2 py-1 data-[long]:min-w-68 xl:px-5"
        // Make use of the all yhe columns available at the end of the table.
        // Visually allows the content to flow under the validity and
        // change time and person columns.
        colSpan={5}
        testId={testIds.newValue}
        value={newValue}
      />
    </tr>
  );
};
