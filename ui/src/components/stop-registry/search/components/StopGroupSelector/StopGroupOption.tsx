import { memo } from 'react';
import { twJoin } from 'tailwind-merge';
import { StopGroupSelectorItem } from './StopGroupSelectorItem';

const testIds = {
  groupSelector: (id: UUID) => `StopGroupSelector::group::${id}`,
};

const NO_BREAK_SPACE = '\xa0';

const baseClasses = twJoin(
  'cursor-pointer rounded border px-2 py-1 text-center font-bold text-dark-grey',
  'aria-checked:border-brand aria-checked:bg-brand aria-checked:text-white',
  'hover:border-black hover:bg-background-hsl-blue hover:text-black',
  'font-mono', // Helps to align the items into a grid
);

type StopGroupOptionProps<ID> = {
  readonly group: StopGroupSelectorItem<ID>;
  readonly longestLabel: number;
  readonly selected: boolean;
  readonly showAll: boolean;
  readonly showAllByDefault: boolean;
  readonly visible: boolean;
};

const StopGroupOptionImpl = <ID extends string>({
  group: { id, label, title },
  longestLabel,
  selected,
  showAll,
  showAllByDefault,
  visible,
}: StopGroupOptionProps<ID>) => {
  return (
    <div
      className={twJoin(baseClasses, showAll || visible ? '' : 'invisible')}
      data-group-id={id}
      data-visible={visible}
      data-testid={testIds.groupSelector(id)}
      id={`select-group-${id}`}
      title={title}
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
    >
      {label.padEnd(
        showAll && !showAllByDefault ? longestLabel : 0,
        NO_BREAK_SPACE,
      )}
    </div>
  );
};

export const StopGroupOption = memo(StopGroupOptionImpl);
