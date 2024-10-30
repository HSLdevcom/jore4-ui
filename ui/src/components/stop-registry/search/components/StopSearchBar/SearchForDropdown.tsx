import { Listbox as HUIListbox, Transition } from '@headlessui/react';
import { TFunction } from 'i18next';
import React, { FC, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { ListboxButton, dropdownTransition } from '../../../../../uiComponents';
import { InputLabel } from '../../../../forms/common';
import { SearchFor, StopSearchFilters } from '../../types';

const disabled: ReadonlyArray<SearchFor> = [
  SearchFor.StopAreas,
  SearchFor.Terminals,
];

function trSearchFor(t: TFunction, searchFor: SearchFor): ReactNode {
  switch (searchFor) {
    case SearchFor.Stops:
      return t('stopRegistrySearch.searchFor.stops');

    case SearchFor.StopAreas:
      return t('stopRegistrySearch.searchFor.stopAreas');

    case SearchFor.Terminals:
      return t('stopRegistrySearch.searchFor.terminals');

    default:
      return null;
  }
}

type SearchForDropdownProps = { readonly className?: string };

export const SearchForDropdown: FC<SearchForDropdownProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const {
    field: { onChange, value, ...controls },
  } = useController<StopSearchFilters, 'searchFor'>({
    name: 'searchFor',
  });

  return (
    <HUIListbox
      as="div"
      className={twMerge('relative', className)}
      onChange={onChange}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...controls}
    >
      <HUIListbox.Label
        as={InputLabel<StopSearchFilters>}
        fieldPath="searchFor"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />

      <ListboxButton hasError={false} buttonContent={trSearchFor(t, value)} />

      <HUIListbox.Options>
        {({ open }) => (
          <Transition
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
