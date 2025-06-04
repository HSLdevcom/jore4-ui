import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { dropdownTransition } from '../../../../../../uiComponents';
import { log } from '../../../../../../utils';
import { SelectedStop } from '../location-details-form/schema';
import { MemberStopOptions } from './MemberStopOptions';
import { SelectedMemberStops } from './SelectedMemberStops';
import { SelectMemberStopsDropdownButton } from './SelectMemberStopsDropdownButton';
import {
  FETCH_MORE_OPTION,
  SelectMemberStopQueryStatus,
} from './SelectMemberStopsQueryStatus';
import { useFindQuaysByQuery } from './useFindQuaysByQuery';

const testIds = {
  input: 'SelectMemberStopsDropdown::input',
  warningText: 'SelectMemberStopsDropdown::warningText',
};

function compareMembersById(a: SelectedStop, b: SelectedStop) {
  return a.stopPlaceId === b.stopPlaceId && a.quayId === b.quayId;
}

function sortByPublicCode(stops: ReadonlyArray<SelectedStop>): SelectedStop[] {
  return stops.toSorted((a, b) => a.publicCode.localeCompare(b.publicCode));
}

function findNewlySelectedStop(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
): SelectedStop | undefined {
  return newValue.find(
    (item) =>
      !currentValue.some(
        (existing) =>
          existing.stopPlaceId === item.stopPlaceId &&
          existing.quayId === item.quayId,
      ),
  );
}

function findDeletedStop(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
): SelectedStop | undefined {
  return currentValue.find(
    (item) =>
      !newValue.some(
        (remaining) =>
          remaining.stopPlaceId === item.stopPlaceId &&
          remaining.quayId === item.quayId,
      ),
  );
}

function getRelatedQuays(
  selectedStop: Readonly<SelectedStop>,
  currentSelection: ReadonlyArray<SelectedStop>,
  options: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  return options.filter((option) => {
    const isSameStopPlace = option.stopPlaceId === selectedStop.stopPlaceId;
    const isDifferentQuay = option.quayId !== selectedStop.quayId;
    const notAlreadySelected = !currentSelection.some(
      (selected) => selected.quayId === option.quayId,
    );

    return isSameStopPlace && isDifferentQuay && notAlreadySelected;
  });
}

function processSelection(
  newValue: ReadonlyArray<SelectedStop>,
  currentValue: ReadonlyArray<SelectedStop>,
  options: ReadonlyArray<SelectedStop>,
): SelectedStop[] {
  const isAddingStops = newValue.length > currentValue.length;
  const isRemovingStops = newValue.length < currentValue.length;

  if (isAddingStops) {
    const newlySelected = findNewlySelectedStop(newValue, currentValue);
    if (!newlySelected) {
      return [...newValue];
    }

    const relatedQuays = getRelatedQuays(newlySelected, newValue, options);
    return [...newValue, ...relatedQuays];
  }

  if (isRemovingStops) {
    const deletedStop = findDeletedStop(newValue, currentValue);
    if (!deletedStop) {
      return [...newValue];
    }

    return newValue.filter(
      (stop) => stop.stopPlaceId !== deletedStop.stopPlaceId,
    );
  }

  return [...newValue];
}

type SelectMemberStopsDropdownProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly value: SelectedStop[] | undefined;
  readonly onChange: (selected: SelectedStop[]) => void;
  readonly testId?: string;
};

export const SelectMemberStopsDropdown: FC<SelectMemberStopsDropdownProps> = ({
  className = '',
  disabled,
  value = [],
  onChange,
  testId,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim();

  const { options, loading, allFetched, fetchNextPage } =
    useFindQuaysByQuery(cleanQuery);

  const unselectedOptions = useMemo(() => {
    const selectedIds = value.map((stop) => stop.stopPlaceId);
    return options.filter((stop) => !selectedIds.includes(stop.stopPlaceId));
  }, [value, options]);

  const hasNoSelectedStops = value.length === 0;

  const handleSelectionChange = (newValue: readonly SelectedStop[]) => {
    if (newValue.includes(FETCH_MORE_OPTION)) {
      fetchNextPage().catch((error) =>
        log.error('Failed to fetch next page:', error),
      );
      return;
    }

    const processedSelection = processSelection(newValue, value, options);
    onChange(sortByPublicCode(processedSelection));
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
      {hasNoSelectedStops && (
        <div className="text-hsl-red">
          <MdWarning className="mr-2 inline text-lg" />
          <span data-testid={testIds.warningText}>
            {t('terminalDetails.location.noMemberStopsSelected')}
          </span>
        </div>
      )}
      <div className="relative w-full">
        <HUICombobox.Input
          className="relative h-full w-full border border-grey bg-white px-2 py-3 ui-open:rounded-b-none ui-not-open:rounded-md"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          aria-label={t('terminalDetails.location.memberStops')}
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
          <SelectedMemberStops selected={value} />

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
