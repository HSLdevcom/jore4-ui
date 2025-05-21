import { Listbox as HUIListbox, Transition } from '@headlessui/react';
import { TFunction } from 'i18next';
import without from 'lodash/without';
import React, { FC, ReactNode } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../../../layoutComponents';
import { StopRegistryMunicipality } from '../../../../../types/enums';
import { ListboxButton, dropdownTransition } from '../../../../../uiComponents';
import { AllOptionEnum, numberEnumEntries } from '../../../../../utils';
import { InputLabel, ValidationErrorList } from '../../../../forms/common';
import { SearchFor, StopSearchFilters } from '../../types';
import { handleAllMunicipalities } from '../../utils';

const testIds = {
  municipalitiesDropdown: 'StopSearchBar::municipalitiesDropdown',
};

function getButtonContent(
  t: TFunction,
  value: ReadonlyArray<StopRegistryMunicipality | AllOptionEnum.All>,
): ReactNode {
  if (value.length === 0) {
    return t('stopRegistrySearch.municipalityPlaceholder');
  }

  if (value.includes(AllOptionEnum.All)) {
    return t('all');
  }

  return t('selected', { count: value.length });
}

type MunicipalityFilterProps = {
  readonly className?: string;
};

export const MunicipalityFilter: FC<MunicipalityFilterProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const {
    field: { onChange, value, ...controls },
  } = useController<StopSearchFilters, 'municipalities'>({
    name: 'municipalities',
  });

  const disabled =
    useFormContext<StopSearchFilters>().watch('searchFor') !== SearchFor.Stops;

  const augmentedOnChange = (
    selected: ReadonlyArray<StopRegistryMunicipality | AllOptionEnum.All>,
  ) => {
    if (
      value.length === 1 &&
      value.at(0) === AllOptionEnum.All &&
      selected.length >= 2
    ) {
      onChange(without(selected, AllOptionEnum.All));
    } else {
      onChange(handleAllMunicipalities(selected));
    }
  };

  return (
    <Column className={className}>
      <HUIListbox
        as="div"
        className="relative"
        disabled={disabled}
        multiple
        onChange={augmentedOnChange}
        value={value}
        data-testid={testIds.municipalitiesDropdown}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...controls}
      >
        <HUIListbox.Label
          as={InputLabel<StopSearchFilters>}
          fieldPath="municipalities"
          translationPrefix="stopRegistrySearch.fieldLabels"
        />

        <ListboxButton
          hasError={false}
          buttonContent={getButtonContent(t, value)}
          testId={`${testIds.municipalitiesDropdown}::ListboxButton`}
        />

        <HUIListbox.Options>
          {({ open }) => (
            <Transition
              data-testid={`${testIds.municipalitiesDropdown}::ListboxOptions`}
              className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
              show={open}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...dropdownTransition}
            >
              <HUIListbox.Option
                as="div"
                className="group flex border-b border-grey px-2 py-2 text-left ui-selected:bg-dark-grey ui-selected:text-white ui-active:bg-dark-grey ui-active:text-white"
                value={AllOptionEnum.All}
              >
                {t('all')}
              </HUIListbox.Option>

              {numberEnumEntries(StopRegistryMunicipality).map(
                ([municipalityName, municipalityNumber]) => (
                  <HUIListbox.Option
                    as="div"
                    className="group flex border-b border-grey px-2 py-2 text-left ui-selected:bg-dark-grey ui-selected:text-white ui-active:bg-dark-grey ui-active:text-white"
                    key={municipalityName}
                    value={municipalityNumber}
                  >
                    {municipalityName}
                  </HUIListbox.Option>
                ),
              )}
            </Transition>
          )}
        </HUIListbox.Options>

        <ValidationErrorList<StopSearchFilters> fieldPath="municipalities" />
      </HUIListbox>
    </Column>
  );
};
