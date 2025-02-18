import { Combobox as HUICombobox, Transition } from '@headlessui/react';
import { FC, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { dropdownTransition } from '../../../../uiComponents';
import { log } from '../../../../utils';
import { StopAreaFormMember } from '../stopAreaFormSchema';
import { MemberStopOptions } from './MemberStopOptions';
import { SelectedMemberStops } from './SelectedMemberStops';
import {
  FETCH_MORE_OPTION,
  SelectMemberStopQueryStatus,
} from './SelectMemberStopQueryStatus';
import { SelectMemberStopsDropdownButton } from './SelectMemberStopsDropdownButton';
import { useFindStopPlaceByQuery } from './useFindStopPlaceByQuery';

const testIds = {
  input: 'SelectMemberStopsDropdown::input',
};

function stopAreaFormMembersAreSame(
  a: StopAreaFormMember,
  b: StopAreaFormMember,
) {
  return a.id === b.id;
}

function compareMembersByLabel(
  a: StopAreaFormMember,
  b: StopAreaFormMember,
): number {
  return a.scheduled_stop_point.label.localeCompare(
    b.scheduled_stop_point.label,
  );
}

type SelectMemberStopsDropdownProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly value: Array<StopAreaFormMember> | undefined;
  readonly editedStopAreaId: string | null | undefined;
  readonly onChange: (selected: Array<StopAreaFormMember>) => void;
  readonly testId?: string;
};

export const SelectMemberStopsDropdown: FC<SelectMemberStopsDropdownProps> = ({
  className = '',
  disabled,
  value = [],
  editedStopAreaId,
  onChange,
  testId,
}: SelectMemberStopsDropdownProps) => {
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim();

  const { options, loading, allFetched, fetchNextPage } =
    useFindStopPlaceByQuery(cleanQuery, editedStopAreaId);

  const unselectedOptions = useMemo(() => {
    const selectedIds = value?.map((stop) => stop.id) ?? [];
    return options.filter((stop) => !selectedIds.includes(stop.id));
  }, [value, options]);

  const onChangeInternal = (newValue: ReadonlyArray<StopAreaFormMember>) => {
    if (newValue.includes(FETCH_MORE_OPTION)) {
      fetchNextPage().catch((error) =>
        log.error('Failed to fetch next page:', error),
      );
    } else {
      onChange(newValue.toSorted(compareMembersByLabel));
    }
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
      by={stopAreaFormMembersAreSame}
      className={twMerge('relative w-full', className)}
      disabled={disabled}
      multiple
      nullable={false}
      onChange={onChangeInternal}
      value={value}
      ref={onCloseRef}
      data-testid={testId}
    >
      <div className="relative w-full">
        <HUICombobox.Input
          className="relative h-full w-full border border-grey bg-white px-2 py-3 ui-open:rounded-b-none ui-not-open:rounded-md"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
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
