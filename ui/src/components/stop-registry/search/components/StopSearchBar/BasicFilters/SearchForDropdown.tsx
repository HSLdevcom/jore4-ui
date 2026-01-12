import pick from 'lodash/pick';
import { FC } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../../layoutComponents';
import { EnumDropdown, InputLabel } from '../../../../../forms/common';
import { SearchFor, StopSearchFilters, defaultFilters } from '../../../types';
import { trSearchFor } from '../../../utils';
import { stopSearchBarTestIds } from '../stopSearchBarTestIds';

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
    field: { onChange: _unusedOnChange, ...controls },
  } = useController<StopSearchFilters, 'searchFor'>({
    name: 'searchFor',
  });

  return (
    <Column className={className}>
      <InputLabel
        fieldPath="searchFor"
        translationPrefix="stopRegistrySearch.fieldLabels"
      />
      <EnumDropdown<SearchFor>
        placeholder=""
        enumType={SearchFor}
        onChange={onChange}
        testId={stopSearchBarTestIds.searchForDropdown}
        uiNameMapper={(key) => trSearchFor(t, key) ?? ''}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...controls}
      />
    </Column>
  );
};
