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

  // Visualize odd-rows within a section differently to improve readability.
  'data-[parity="odd"]:bg-background',
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
      <td className="px-2 py-1 xl:pr-5" data-testid={testIds.name}>
        {field}
      </td>
      <ChangedValueCell
        className="px-2 py-1 xl:px-5"
        testId={testIds.oldValue}
        value={oldValue}
      />
      <ChangedValueCell
        className="px-2 py-1 xl:px-5"
        testId={testIds.newValue}
        value={newValue}
      />
      <td aria-hidden colSpan={4}>
        {null}
      </td>
    </tr>
  );
};
