import React, { FC, useEffect, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToggle } from '../../../../../hooks';
import { Column, Row, Visible } from '../../../../../layoutComponents';
import { ChevronToggle, SimpleButton } from '../../../../../uiComponents';
import { DateInputField, InputField } from '../../../../forms/common';
import { SearchFor, StopSearchFilters } from '../../types';
import { MunicipalityFilter } from './MunicipalityFilter';
import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';
import { SearchForDropdown } from './SearchForDropdown';

const testIds = {
  searchInput: 'StopSearchBar::searchInput',
  toggleExpand: 'StopSearchBar::chevronToggle',
  searchButton: 'StopSearchBar::searchButton',
  elyInput: 'StopSearchBar::elyInput',
  observationDateInput: 'StopSearchBar::observationDateInput',
};

type StopSearchBarProps = {
  readonly initialFilters: StopSearchFilters;
  readonly onSubmit: (filters: StopSearchFilters) => void;
};

export const StopSearchBar: FC<StopSearchBarProps> = ({
  initialFilters,
  onSubmit,
}) => {
  const { t } = useTranslation();

  const [isExpanded, toggleIsExpanded] = useToggle();
  const formRef = useRef<HTMLFormElement | null>(null);

  const methods = useForm<StopSearchFilters>({
    defaultValues: initialFilters,
  });

  // Previous implementation triggered the search when changing the searchBy value.
  // So, to remain compatible with existing test cases, this implementation needs,
  // to do the same.
  const [searchBy, query] = methods.watch(['searchBy', 'query']);
  useEffect(() => {
    if (initialFilters.searchBy !== searchBy && query !== '') {
      formRef.current?.requestSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchBy]);

  const notForStops = methods.watch('searchFor') !== SearchFor.Stops;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className="container mx-auto flex flex-col py-10"
        onSubmit={methods.handleSubmit(onSubmit)}
        ref={formRef}
      >
        <Column className="items-stretch space-y-4 bg-background px-10 py-4">
          <Row className="justify-center space-x-4">
            <SearchForDropdown className="w-2/6 xl:w-1/6" />
            <Row className="w-4/6 space-x-4 xl:w-2/6">
              <InputField<StopSearchFilters>
                className="flex-grow"
                inputClassName="py-3 h-auto"
                fieldPath="query"
                translationPrefix="stopRegistrySearch.fieldLabels"
                testId={testIds.searchInput}
                type="search"
              />

              <ChevronToggle
                className="mt-[18px]"
                testId={testIds.toggleExpand}
                isToggled={isExpanded}
                onClick={toggleIsExpanded}
                controls="advanced-search"
                openTooltip={t('accessibility:common.expandSearch')}
                closeTooltip={t('accessibility:common.closeSearch')}
              />
            </Row>
          </Row>

          <Row className="justify-start md:justify-center md:space-x-4">
            <div className="hidden w-2/6 md:block xl:w-1/6" />
            <SearchCriteriaRadioButtons className="w-4/6 flex-grow xl:w-2/6 xl:flex-grow-0" />
          </Row>
        </Column>

        <Visible visible={isExpanded}>
          <div
            id="advanced-search"
            className="space-y-5 border-2 border-background p-10"
          >
            <h2>{t('search.advancedSearchTitle')}</h2>
            <Row className="items-stretch space-x-4">
              <InputField<StopSearchFilters>
                className="w-1/6"
                inputClassName="flex-grow"
                disabled={notForStops}
                fieldPath="elyNumber"
                translationPrefix="stopRegistrySearch.fieldLabels"
                testId={testIds.elyInput}
                type="text"
              />

              <MunicipalityFilter className="w-1/6" />

              <DateInputField<StopSearchFilters>
                className="w-1/6"
                inputClassName="flex-grow"
                fieldPath="observationDate"
                testId={testIds.observationDateInput}
                translationPrefix="filters"
              />
            </Row>
          </div>

          <Row className="flex justify-end bg-background py-4">
            <SimpleButton
              containerClassName="mr-6"
              type="submit"
              testId={testIds.searchButton}
            >
              {t('search.search')}
            </SimpleButton>
          </Row>
        </Visible>
      </form>
    </FormProvider>
  );
};
