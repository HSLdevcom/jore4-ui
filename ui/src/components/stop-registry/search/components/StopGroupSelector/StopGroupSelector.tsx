import { RadioGroup } from '@headlessui/react';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { Visible } from '../../../../../layoutComponents';
import { StopGroupSelectorItem } from './StopGroupSelectorItem';
import { useVisibilityMap } from './useVisibilityMap';

const testIds = {
  groupSelector: (id: UUID) => `StopGroupSelector::group::${id}`,
  showAll: `StopGroupSelector::showAllButton`,
  showLess: `StopGroupSelector::showLessButton`,
};

type StopGroupSelectorProps<ID> = {
  readonly className?: string;
  readonly groups: ReadonlyArray<StopGroupSelectorItem<ID>>;
  readonly label: ReactNode;
  readonly onSelect: (selected: UUID | null) => void;
  readonly selected: ID | null;
};

const SHOW_ALL_BY_DEFAULT_MAX = 20;
const MAX_PADDING = 5;
const NO_BREAK_SPACE = '\xa0';

export const StopGroupSelector = <ID extends string>({
  className,
  groups,
  label: radioGroupLabel,
  onSelect,
  selected,
}: StopGroupSelectorProps<ID>) => {
  const { t } = useTranslation();

  const showAllByDefault = groups.length <= SHOW_ALL_BY_DEFAULT_MAX;
  const [showAll, setShowAll] = useState(showAllByDefault);
  useEffect(() => setShowAll(showAllByDefault), [showAllByDefault]);

  const groupListRef = useRef<HTMLDivElement | null>(null);
  const groupIds = useMemo(() => groups.map((group) => group.id), [groups]);
  const visibilityMap = useVisibilityMap(showAll, groupIds, groupListRef);

  const someGroupIsHidden = Object.values(visibilityMap).some(
    (visible) => !visible,
  );

  const longestLabel = Math.min(
    Math.max(...groups.map((group) => group.label.length)),
    MAX_PADDING,
  );

  return (
    <RadioGroup
      className={twMerge('flex gap-2', className)}
      onChange={onSelect}
      value={selected}
    >
      <RadioGroup.Label className="mt-2">{radioGroupLabel}</RadioGroup.Label>

      <div
        className={twJoin(
          'flex items-center gap-2 overflow-hidden',
          showAll ? 'flex-wrap' : '',
        )}
        ref={groupListRef}
      >
        {groups.map(({ id, label, title }) => (
          <RadioGroup.Option
            className={twJoin(
              'cursor-pointer rounded border px-2 py-1 text-center font-bold text-dark-grey',
              'ui-checked:border-brand ui-checked:bg-brand ui-checked:text-white',
              'hover:border-black hover:bg-background-hsl-blue hover:text-black',
              'font-mono', // Helps to align the items into a grid
              showAll || visibilityMap[id] ? '' : 'invisible',
            )}
            data-group-id={id}
            data-visible={visibilityMap[id]}
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
        ))}

        {/* Hide button is nested in here to render the button as a last element in the list. */}
        <Visible visible={!showAllByDefault && showAll}>
          <button
            className="text-nowrap text-base font-bold text-brand"
            data-testid={testIds.showLess}
            onClick={() => setShowAll(false)}
            type="button"
          >
            {t('stopRegistrySearch.showLessLines')}
          </button>
        </Visible>
      </div>

      {/* Show more button is outside the list as to exclude from the overflow calculations.  */}
      <Visible visible={!showAll && someGroupIsHidden}>
        <button
          className="text-nowrap text-base font-bold text-brand"
          data-testid={testIds.showAll}
          onClick={() => setShowAll(true)}
          type="button"
        >
          {t('stopRegistrySearch.showAllLines', { count: groups.length })}
        </button>
      </Visible>
    </RadioGroup>
  );
};
