import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { mapToShortDate } from '../../../../time';
import { dropdownTransition } from '../../../../uiComponents';
import { log } from '../../../../utils';
import { MemberStopOptions } from '../../../stop-registry/components/SelectMemberStops/MemberStopOptions';
import { SelectedStop } from '../../../stop-registry/components/SelectMemberStops/schema';
import {
  FETCH_MORE_OPTION,
  SelectMemberStopQueryStatus,
} from '../../../stop-registry/components/SelectMemberStops/SelectMemberStopsQueryStatus';
import { useFindQuaysByQuery } from '../../../stop-registry/components/SelectMemberStops/useFindQuaysByQuery';
import { SelectMemberStopsDropdownButton } from './SelectMemberStopsDropdownButton';

export const testIds = {
  input: 'SelectMemberStopsDropdown::input',
  warningText: 'SelectMemberStopsDropdown::warningText',
};

export function compareMembersById(
  a: SelectedStop | null | undefined,
  b: SelectedStop | null | undefined,
): boolean {
  if (!a || !b) {
    return a === b;
  }
  return a.stopPlaceId === b.stopPlaceId && a.quayId === b.quayId;
}

export function sortByPublicCode(
  stops: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  return stops.toSorted((a, b) => a.publicCode.localeCompare(b.publicCode));
}

type SelectMemberStopsDropdownProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly value: SelectedStop | null;
  readonly onSelectionChange: (
    newValue: SelectedStop | null,
    currentValue: SelectedStop | null,
    options: SelectedStop[],
  ) => void;
  readonly testId?: string;
  readonly inputAriaLabel?: string;
  readonly areaId?: string;
};

export const SelectMemberStopsDropdownArea: FC<
  SelectMemberStopsDropdownProps
> = ({
  className = '',
  disabled,
  value,
  testId,
  onSelectionChange,
  inputAriaLabel,
  areaId,
}) => {
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const cleanQuery = query.trim();

  const { options, loading, allFetched, fetchNextPage } =
    useFindQuaysByQuery(cleanQuery);

  const unselectedOptions = useMemo(() => {
    return options.filter(
      (stop) => stop.quayId !== value?.quayId && stop.stopPlaceId !== areaId,
    );
  }, [options, value?.quayId, areaId]);

  const handleSelectionChange = (newValue: SelectedStop | null) => {
    if (newValue === FETCH_MORE_OPTION) {
      fetchNextPage().catch((error) =>
        log.error('Failed to fetch next page:', error),
      );
      return;
    }

    setQuery('');
    onSelectionChange(newValue, value, options);
  };

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
            setIsInputFocused(false);
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
      nullable={false}
      onChange={handleSelectionChange}
      value={value}
      ref={onCloseRef}
      data-testid={testId}
    >
      <div className="relative w-full">
        <HUICombobox.Input
          className="relative h-full w-full border border-grey bg-white px-2 py-3 pr-16 ui-open:rounded-b-none ui-not-open:rounded-md"
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          value={query}
          aria-label={inputAriaLabel}
          data-testid={testIds.input}
        />

        {value && !query.trim() && !isInputFocused && (
          <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
            <span
              className="text-black"
              title={`${value.publicCode} ${value.name}`}
            >
              <strong>
                {value.publicCode} {value.name}
              </strong>{' '}
              {mapToShortDate(value.validityStart)} -{' '}
              {mapToShortDate(value.validityEnd)}
            </span>
          </div>
        )}

        <SelectMemberStopsDropdownButton />
      </div>

      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Transition {...dropdownTransition}>
        <HUICombobox.Options
          as="div"
          className="absolute left-0 z-10 w-full rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
        >
          <MemberStopOptions options={unselectedOptions} />

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
