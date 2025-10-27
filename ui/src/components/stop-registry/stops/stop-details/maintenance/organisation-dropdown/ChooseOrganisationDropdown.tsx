import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../../generated/graphql';
import {
  FormInputProps as ListboxInputProps,
  SearchableDropdown,
} from '../../../../../../uiComponents';
import { useChooseOrganisationDropdown } from './useChooseOrganisationDropdown';

export const CREATE_NEW_ORGANISATION_OPTION = 'createNewOrganisation';

type ChooseOrganisationDropdownProps = ListboxInputProps & {
  readonly testId?: string;
  readonly optionAmount?: number;
};

const mapToOption = (item: StopPlaceOrganisationFieldsFragment) => ({
  key: item.id ?? '',
  value: item.id ?? '',
  render: () => <span>{item.name ?? ''}</span>,
});

const createNewOrganisationOption = (t: (key: string) => string) => ({
  key: CREATE_NEW_ORGANISATION_OPTION,
  value: CREATE_NEW_ORGANISATION_OPTION,
  render: () => (
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

  const nullOptionRender = () => (
    <div className="flex flex-col">
      {t('stopDetails.maintenance.organisation.noContractor')}
    </div>
  );

  return (
    <SearchableDropdown
      id="choose-organisation-combobox"
      query={query}
      testId={testId}
      mapToButtonContent={mapToButtonContent}
      nullOptionRender={query ? undefined : nullOptionRender}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onQueryChange={setQuery}
      selectedItem={selectedOrganisation}
    />
  );
};
