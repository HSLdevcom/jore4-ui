import { Listbox as HUIListbox, Transition } from '@headlessui/react';
import pick from 'lodash/pick';
import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ListboxButton, dropdownTransition } from '../../../../../uiComponents';
import { InputLabel } from '../../../../forms/common';
import { SearchFor, StopSearchFilters, defaultFilters } from '../../types';
import { trSearchFor } from '../../utils';

const testIds = {
  searchForDropdown: 'StopSearchBar::SearchForDropdown',
};

const disabled: ReadonlyArray<SearchFor> = [SearchFor.Terminals];

function useResetAndSetSearchFor() {
  const { getValues, reset } = useFormContext<StopSearchFilters>();

  return (searchFor: SearchFor) =>
    reset({
      ...defaultFilters,
      ...pick(getValues(), 'query', 'observationDate'),
      searchFor,
    });
}

type SearchForDropdownProps = { readonly className?: string };

export const SearchForDropdown: FC<SearchForDropdownProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const onChange = useResetAndSetSearchFor();

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    field: { onChange: _unusedOnChange, value, ...controls },
  } = useController<StopSearchFilters, 'searchFor'>({
    name: 'searchFor',
  });

  return (
    <HUIListbox
      as="div"
      className={twMerge('relative', className)}
      onChange={onChange}
      value={value}
      data-testid={testIds.searchForDropdown}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...controls}
    >
      <HUIListbox.Label
        as={InputLabel<StopSearchFilters>}
        fieldPath="searchFor"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <ListboxButton
        hasError={false}
        buttonContent={trSearchFor(t, value)}
        testId={`${testIds.searchForDropdown}::ListboxButton`}
      />

      <HUIListbox.Options>
        {({ open }) => (
          <Transition
            data-testid={`${testIds.searchForDropdown}::ListboxOptions`}
            className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
            show={open}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...dropdownTransition}
          >
            {Object.values(SearchFor).map((searchFor) => (
              <HUIListbox.Option
                as="div"
                className="group flex border-b border-grey px-2 py-2 text-left ui-selected:bg-dark-grey ui-selected:text-white ui-active:bg-dark-grey ui-active:text-white"
                key={searchFor}
                value={searchFor}
                disabled={disabled.includes(searchFor)}
              >
                {trSearchFor(t, searchFor)}
              </HUIListbox.Option>
            ))}
          </Transition>
        )}
      </HUIListbox.Options>
    </HUIListbox>
  );
};
