import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../../generated/graphql';
import {
  ComboboxOptionItem,
  FormInputProps as ListboxInputProps,
  SearchableDropdown,
} from '../../../../../../uiComponents';
import { useChooseOrganisationDropdown } from './useChooseOrganisationDropdown';

export const CREATE_NEW_ORGANISATION_OPTION = 'createNewOrganisation';

type ChooseOrganisationDropdownProps = ListboxInputProps & {
  readonly testId?: string;
  readonly optionAmount?: number;
};

const mapToOption = (
  item: StopPlaceOrganisationFieldsFragment,
): ComboboxOptionItem => ({
  value: item.id ?? '',
  content: item.name,
});

const createNewOrganisationOption = (
  t: (key: string) => string,
): ComboboxOptionItem => ({
  value: CREATE_NEW_ORGANISATION_OPTION,
  content: (
    <div className="flex items-center gap-2">
      {t('stopDetails.maintenance.organisation.createNewOrganisation')}
      <AiFillPlusCircle className="text-m text-brand" />
    </div>
  ),
});

export const ChooseOrganisationDropdown: FC<
  ChooseOrganisationDropdownProps
> = ({ testId, value, onChange, onBlur, optionAmount = 15 }) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  const { organisations, selectedOrganisation } = useChooseOrganisationDropdown(
    query,
    value,
    optionAmount - 1, // Reserve one slot for "create new" option
  );

  const organisationOptions = organisations.map(mapToOption) ?? [];
  const options = [createNewOrganisationOption(t), ...organisationOptions];

  const mapToButtonContent = (
    displayedOrganisation?: StopPlaceOrganisationFieldsFragment,
  ) => {
    return <div className="w-full">{displayedOrganisation?.name ?? '-'}</div>;
  };

  return (
    <SearchableDropdown
      id="choose-organisation-combobox"
      query={query}
      testId={testId}
      mapToButtonContent={mapToButtonContent}
      nullOptionContent={
        query
          ? undefined
          : t('stopDetails.maintenance.organisation.noContractor')
      }
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onQueryChange={setQuery}
      selectedItem={selectedOrganisation}
    />
  );
};
