import { Combobox, ComboboxInput, ComboboxOptions } from '@headlessui/react';
import { FC, useMemo, useState } from 'react';
import { mapToShortDate } from '../../../../../time';
import {
  JoreComboboxButton,
  comboboxStyles,
} from '../../../../../uiComponents';
import { log } from '../../../../../utils';
import {
  FETCH_MORE_OPTION,
  MemberStopOptions,
  SelectMemberStopQueryStatus,
  SelectedStop,
  useFindQuaysByQuery,
} from '../common';

const testIds = {
  input: 'SelectStopDropdown::input',
  button: 'SelectStopDropdownButton',
  warningText: 'SelectStopDropdown::warningText',
};

function compareMembersById(
  a: SelectedStop | null | undefined,
  b: SelectedStop | null | undefined,
): boolean {
  if (!a || !b) {
    return a === b;
  }
  return a.stopPlaceId === b.stopPlaceId && a.quayId === b.quayId;
}

type SelectStopDropdown = {
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

export const SelectStopDropdown: FC<SelectStopDropdown> = ({
  className,
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
    <Combobox
      as="div"
      by={compareMembersById}
      className={comboboxStyles.root(className)}
      disabled={disabled}
      onChange={handleSelectionChange}
      value={value}
      ref={onCloseRef}
      data-testid={testId}
    >
      <div className="relative">
        <ComboboxInput
          className={comboboxStyles.input()}
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

        <JoreComboboxButton testId={testIds.button} />
      </div>

      <ComboboxOptions
        anchor="bottom start"
        className={comboboxStyles.options('w-(--input-width)')}
        transition
      >
        <MemberStopOptions options={unselectedOptions} />

        <SelectMemberStopQueryStatus
          allFetched={allFetched}
          loading={loading}
          query={cleanQuery}
        />
      </ComboboxOptions>
    </Combobox>
  );
};
