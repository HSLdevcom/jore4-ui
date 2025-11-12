import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, ReactNode, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { dropdownTransition } from '../../../../../uiComponents';
import { log } from '../../../../../utils';
import {
  FETCH_MORE_OPTION,
  MemberStopOptions,
  SelectMemberStopQueryStatus,
  SelectedMemberStops,
  SelectedStop,
  useFindQuaysByQuery,
} from '../common';
import { SelectMemberStopsDropdownButton } from '../common/SelectMemberStopsDropdownButton';

const testIds = {
  input: 'BaseSelectMemberStopsDropdown::input',
};

function compareMembersById(a: SelectedStop, b: SelectedStop) {
  return a.stopPlaceId === b.stopPlaceId && a.quayId === b.quayId;
}

export function sortByPublicCode(
  stops: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  return stops.toSorted((a, b) => a.publicCode.localeCompare(b.publicCode));
}

export type SelectMemberStopsDropdownProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly value: SelectedStop[] | undefined;
  readonly onChange: (selected: SelectedStop[]) => void;
  readonly testId?: string;
};

type BaseSelectMemberStopsDropdownProps = SelectMemberStopsDropdownProps & {
  readonly onSelectionChange: (
    newValue: readonly SelectedStop[],
    currentValue: SelectedStop[],
    allQueryResults: SelectedStop[],
  ) => void;
  readonly renderWarning?: () => ReactNode;
  readonly inputAriaLabel?: string;
};

export const BaseSelectMemberStopsDropdown: FC<
  BaseSelectMemberStopsDropdownProps
> = ({
  className = '',
  disabled,
  value = [],
  testId,
  onSelectionChange,
  renderWarning,
  inputAriaLabel,
}) => {
  const [query, setQuery] = useState('');
  const [hoveredStopPlaceId, setHoveredStopPlaceId] = useState<
    string | undefined
  >();
  const cleanQuery = query.trim();

  const { options, allQueryResults, loading, allFetched, fetchNextPage } =
    useFindQuaysByQuery(cleanQuery);

  const unselectedOptions = useMemo(() => {
    const selectedIds = value.map((stop) => stop.stopPlaceId);
    return options.filter((stop) => !selectedIds.includes(stop.stopPlaceId));
  }, [value, options]);

  const handleSelectionChange = (newValue: readonly SelectedStop[]) => {
    if (newValue.includes(FETCH_MORE_OPTION)) {
      fetchNextPage().catch((error) =>
        log.error('Failed to fetch next page:', error),
      );
      return;
    }

    onSelectionChange(newValue, value, allQueryResults);
  };

  const [mutationObserver] = useState<MutationObserver>(
    () =>
      new MutationObserver((changes) => {
        for (const change of changes) {
          if (
            change.target instanceof HTMLElement &&
            change.target.dataset.headlessuiState === ''
          ) {
            setQuery('');
          }
        }
      }),
  );

  const onCloseRef = (div: HTMLDivElement | null) => {
    mutationObserver.disconnect();
    if (div) {
      mutationObserver.observe(div, {
        attributeFilter: ['data-headlessui-state'],
      });
    }
  };

  return (
    <HUICombobox
      as="div"
      by={compareMembersById}
      className={twMerge('relative w-full', className)}
      disabled={disabled}
      multiple
      nullable={false}
      onChange={handleSelectionChange}
      value={value}
      ref={onCloseRef}
      data-testid={testId}
    >
      {renderWarning?.()}

      <div className="relative w-full">
        <HUICombobox.Input
          className="relative h-full w-full border border-grey bg-white px-2 py-3 ui-open:rounded-b-none ui-not-open:rounded-md"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          aria-label={inputAriaLabel}
          data-testid={testIds.input}
        />

        <SelectMemberStopsDropdownButton selected={value} />
      </div>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Transition {...dropdownTransition}>
        <HUICombobox.Options
          as="div"
          className="absolute left-0 z-10 w-full rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
        >
          <SelectedMemberStops
            selected={value}
            hoveredStopPlaceId={hoveredStopPlaceId}
            onHover={setHoveredStopPlaceId}
          />
          <MemberStopOptions options={unselectedOptions} allowDisable />

          <SelectMemberStopQueryStatus
            allFetched={allFetched}
            loading={loading}
            query={cleanQuery}
          />
        </HUICombobox.Options>
      </Transition>
    </HUICombobox>
  );
};
