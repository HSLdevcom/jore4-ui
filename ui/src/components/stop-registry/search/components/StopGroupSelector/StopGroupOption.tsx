import { RadioGroup } from '@headlessui/react';
import { memo } from 'react';
import { twJoin } from 'tailwind-merge';
import { StopGroupSelectorItem } from './StopGroupSelectorItem';

const testIds = {
  groupSelector: (id: UUID) => `StopGroupSelector::group::${id}`,
};

const NO_BREAK_SPACE = '\xa0';

const baseClasses = twJoin(
  'cursor-pointer rounded border px-2 py-1 text-center font-bold text-dark-grey',
  'ui-checked:border-brand ui-checked:bg-brand ui-checked:text-white',
  'hover:border-black hover:bg-background-hsl-blue hover:text-black',
  'font-mono', // Helps to align the items into a grid
);

type StopGroupOptionProps<ID> = {
  readonly group: StopGroupSelectorItem<ID>;
  readonly longestLabel: number;
  readonly showAll: boolean;
  readonly showAllByDefault: boolean;
  readonly visible: boolean;
};

const StopGroupOptionImpl = <ID extends string>({
  group: { id, label, title },
  longestLabel,
  showAll,
  showAllByDefault,
  visible,
}: StopGroupOptionProps<ID>) => {
  return (
    <RadioGroup.Option
      className={twJoin(baseClasses, showAll || visible ? '' : 'invisible')}
      data-group-id={id}
      data-visible={visible}
      data-testid={testIds.groupSelector(id)}
      id={`select-group-${id}`}
      key={id}
      title={title}
      value={id}
    >
      {label.padEnd(
        showAll && !showAllByDefault ? longestLabel : 0,
        NO_BREAK_SPACE,
      )}
    </RadioGroup.Option>
  );
};

export const StopGroupOption = memo(StopGroupOptionImpl);
