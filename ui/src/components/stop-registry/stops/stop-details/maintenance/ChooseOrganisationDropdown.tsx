import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { StopPlaceOrganisationFieldsFragment } from '../../../../../generated/graphql';
import { FormInputProps, Listbox } from '../../../../../uiComponents';

export const CREATE_NEW_ORGANISATION_OPTION = 'createNewOrganisation';

const testIds = {
  dropdown: 'ChooseOrganisationDropdown::button',
};

interface Props extends FormInputProps {
  id?: string;
  testId?: string;
  organisations: ReadonlyArray<StopPlaceOrganisationFieldsFragment>;
}

const uiNameMapper = (val: StopPlaceOrganisationFieldsFragment | undefined) => {
  return val?.name ?? undefined;
};

const mapToOption = (optionId: string, uiText: string) => ({
  key: optionId,
  value: optionId,
  render: () => {
    return <div className="cursor-default px-4">{uiText}</div>;
  },
});

export const ChooseOrganisationDropdown = ({
  id,
  testId,
  value,
  organisations,
  ...formInputProps
}: Props) => {
  const { t } = useTranslation();
  const selectedOrganisation = organisations.find((o) => o?.id === value);
  const sortedOrganisations = sortBy(organisations, uiNameMapper);

  const options = [
    mapToOption(String(null), '-'),
    ...sortedOrganisations.map((o) =>
      mapToOption(String(o.id ?? null), uiNameMapper(o) ?? ''),
    ),
    {
      key: CREATE_NEW_ORGANISATION_OPTION,
      value: CREATE_NEW_ORGANISATION_OPTION,
      render: ({ active }: { active: boolean }) => (
        <div
          className={`align-center flex cursor-default justify-between border border-brand px-4 ${active ? '!bg-brand !text-white' : 'bg-hsl-neutral-blue text-black'}`}
        >
          {t('stopDetails.maintenance.organisation.createNewOrganisation')}
          <AiFillPlusCircle
            className={`text-xl text-brand ${active ? 'text-white' : ''}`}
          />
        </div>
      ),
    },
  ];

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={uiNameMapper(selectedOrganisation) ?? '-'}
      options={options}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
