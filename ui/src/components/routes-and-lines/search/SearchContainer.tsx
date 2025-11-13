import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Row, Visible } from '../../../layoutComponents';
import { useToggle } from '../../common/hooks/useToggle';
import { ExpandedSearchButtons } from '../../common/search';
import {
  PriorityFilter,
  TransportationModeFilter,
} from '../../common/search/ExtraFilters';
import {
  ExtraFiltersToggle,
  SearchQueryFilter,
} from '../../common/search/SearchBar';
import { useSearch } from '../../common/search/useSearch';
import {
  mapFiltersToSearchConditions,
  mapSearchConditionsToFilters,
} from '../../common/search/utils';
import { DateInputField } from '../../forms/common';
import { LineTypeFilter } from './filters/LineTypeFilter';
import { routesAndLinesTestIds } from './routesAndLinesTestIds';
import { RoutesAndLinesSearchFilters } from './types';
import { SearchNavigationState } from './types/SearchNavigationState';

const generateNavigationState = (
  isExpanded: boolean,
): SearchNavigationState => {
  return {
    searchExpanded: isExpanded,
  };
};

type SearchContainerProps = {
  readonly searchExpandChanged?: (val: boolean) => void;
};

export const SearchContainer: FC<SearchContainerProps> = ({
  searchExpandChanged,
}) => {
  const { searchConditions, handleSearch } = useSearch();
  const { t } = useTranslation();
  const location = useLocation();
  const extraFiltersId = useId();

  const methods = useForm<RoutesAndLinesSearchFilters>({
    defaultValues: mapSearchConditionsToFilters(searchConditions),
  });

  const [isExpanded, toggleIsExpanded] = useToggle(
    location.state?.searchExpanded,
  );

  const toggleExpand = () => {
    searchExpandChanged?.(!isExpanded);
    toggleIsExpanded();
  };

  const onSubmit = (nextFilters: RoutesAndLinesSearchFilters) => {
    const combinedFilters = mapFiltersToSearchConditions({
      ...searchConditions,
      ...nextFilters,
    });

    handleSearch(combinedFilters, generateNavigationState(isExpanded));
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className="container mx-auto flex flex-col py-10"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <Row className="justify-center gap-x-4 bg-background py-4">
          <DateInputField<RoutesAndLinesSearchFilters>
            className="min-w-40"
            inputClassName="flex-grow"
            fieldPath="observationDate"
            testId={routesAndLinesTestIds.observationDateInput}
            translationPrefix="filters"
          />

          <SearchQueryFilter<RoutesAndLinesSearchFilters>
            testIdPrefix={routesAndLinesTestIds.prefix}
            fieldPath="query"
            translationPrefix="stopRegistrySearch.fieldLabels"
            className="w-4/6 xl:w-2/6"
          />

          <ExtraFiltersToggle
            className="mt-[25px]"
            extraFiltersId={extraFiltersId}
            searchIsExpanded={isExpanded}
            toggleSearchIsExpanded={toggleExpand}
            testIdPrefix={routesAndLinesTestIds.prefix}
          />
        </Row>

        <Visible visible={isExpanded}>
          <div
            id={extraFiltersId}
            className="space-y-5 border-2 border-background p-10"
          >
            <h2>{t('search.advancedSearchTitle')}</h2>
            <Row className="space-x-4">
              <TransportationModeFilter<RoutesAndLinesSearchFilters>
                testIdPrefix={routesAndLinesTestIds.prefix}
                translationPrefix="lines"
                fieldPath="transportMode"
                className="sm:-order-2 md:order-none"
              />

              <PriorityFilter<RoutesAndLinesSearchFilters>
                testIdPrefix={routesAndLinesTestIds.prefix}
                translationPrefix="lines"
                fieldPath="priorities"
                className="mr-auto"
              />

              <LineTypeFilter testId={routesAndLinesTestIds.lineTypeDropdown} />
            </Row>
          </div>
          <ExpandedSearchButtons
            testIdPrefix="SearchContainer"
            toggleExpand={toggleExpand}
            searchButtonType="submit"
          />
        </Visible>
      </form>
    </FormProvider>
  );
};
