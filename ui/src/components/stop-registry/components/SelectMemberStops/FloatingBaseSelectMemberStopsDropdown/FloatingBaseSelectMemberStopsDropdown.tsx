import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import {
  FC,
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { dropdownTransition } from '../../../../../uiComponents';
import { log } from '../../../../../utils';
import { SelectMemberStopsDropdownProps } from '../BaseSelectMemberStopsDropdown';
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

type FloatingBaseSelectMemberStopsDropdownProps =
  SelectMemberStopsDropdownProps & {
    readonly onSelectionChange: (
      newValue: readonly SelectedStop[],
      currentValue: SelectedStop[],
      allQueryResults: SelectedStop[],
    ) => void;
    readonly renderWarning?: () => ReactNode;
    readonly inputAriaLabel?: string;
  };

export const FloatingBaseSelectMemberStopsDropdown: FC<
  FloatingBaseSelectMemberStopsDropdownProps
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

  // Floating UI positioning
  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(0),
      flip({ fallbackPlacements: ['bottom-start'] }),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

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

  const [anchorWidth, setAnchorWidth] = useState<number | undefined>(undefined);
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState<
    number | undefined
  >(undefined);
  const selectedRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const refEl = refs.reference.current;
    let selectedHeight = 0;
    if (selectedRef.current) {
      selectedHeight = selectedRef.current.offsetHeight;
    }
    if (refEl && 'offsetWidth' in refEl && 'getBoundingClientRect' in refEl) {
      setAnchorWidth((refEl as HTMLElement).offsetWidth);
      const rect = (refEl as HTMLElement).getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - 8; // 8px margin
      const maxScrollable = spaceBelow - selectedHeight;
      setDropdownMaxHeight(maxScrollable > 100 ? maxScrollable : 100); // Minimum 100px
    }
  }, [refs.reference, query, value.length]);

  const [mutationObserver] = useState<MutationObserver>(
    () =>
      new MutationObserver((changes) => {
        // eslint-disable-next-line no-restricted-syntax
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
      data-testid={testId}
    >
      {({ open }) => {
        return (
          <>
            {renderWarning?.()}

            <div className="relative w-full" ref={refs.setReference}>
              <HUICombobox.Input
                className="relative h-full w-full border border-grey bg-white px-2 py-3 ui-open:rounded-b-none ui-not-open:rounded-md"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
                aria-label={inputAriaLabel}
                data-testid={testIds.input}
                ref={onCloseRef}
              />

              <SelectMemberStopsDropdownButton selected={value} />
            </div>

            {open && (
              <FloatingPortal>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Transition {...dropdownTransition}>
                  <HUICombobox.Options
                    as="div"
                    ref={refs.setFloating}
                    style={{
                      ...floatingStyles,
                      width: anchorWidth,
                    }}
                    className="z-[1200] rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
                  >
                    <div ref={selectedRef}>
                      <SelectedMemberStops
                        selected={value}
                        hoveredStopPlaceId={hoveredStopPlaceId}
                        onHover={setHoveredStopPlaceId}
                      />
                    </div>
                    <div
                      style={{
                        maxHeight: dropdownMaxHeight,
                        overflowY: 'auto',
                      }}
                    >
                      <MemberStopOptions
                        options={unselectedOptions}
                        allowDisable
                      />
                      <SelectMemberStopQueryStatus
                        allFetched={allFetched}
                        loading={loading}
                        query={cleanQuery}
                      />
                    </div>
                  </HUICombobox.Options>
                </Transition>
              </FloatingPortal>
            )}
          </>
        );
      }}
    </HUICombobox>
  );
};
