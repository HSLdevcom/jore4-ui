import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';
import { FormInputProps, Listbox } from '../../../../../uiComponents';

export const CREATE_NEW_ORGANISATION_OPTION = 'createNewOrganisation';

const testIds = {
  dropdown: 'ChooseOrganisationDropdown::button',
};

interface Props extends FormInputProps {
  id?: string;
  testId?: string;
  organisations: Array<StopPlaceOrganisationFieldsFragment>;
}

export const ChooseOrganisationDropdown = ({
  id,
  testId,
  value,
  organisations,
  ...formInputProps
}: Props) => {
  const { t } = useTranslation();
  const selectedOrganisation = organisations.find((o) => o?.id === value);

  const uiNameMapper = (
    val: StopPlaceOrganisationFieldsFragment | undefined,
  ) => {
    return val?.name ?? undefined;
  };

  const mapToOption = (optionId: string, uiText: string) => ({
    key: optionId,
    value: optionId,
    render: () => {
      return (
        <div className="cursor-default">
          <div className="ml-2 mr-2">{uiText}</div>
        </div>
      );
    },
  });

  const sortedOrganisations = sortBy(organisations, uiNameMapper);

  const options = [
    mapToOption(String(null), '-'),
    ...sortedOrganisations.map((o) =>
      mapToOption(String(o.id ?? null), uiNameMapper(o) ?? ''),
    ),
    mapToOption(
      CREATE_NEW_ORGANISATION_OPTION,
      t('stopDetails.maintenance.organisation.createNewOrganisation'),
    ),
  ];

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={
        selectedOrganisation ? uiNameMapper(selectedOrganisation) : '-'
      }
      options={options}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
