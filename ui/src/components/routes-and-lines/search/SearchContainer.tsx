import { DateTime } from 'luxon';
import { ChangeEventHandler, FC, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Container, Row, Visible } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { AllOptionEnum } from '../../../utils';
import { useToggle } from '../../common/hooks/useToggle';
import { ExpandedSearchButtons } from '../../common/search';
import { useSearch } from '../../common/search/useSearch';
import { SearchQueryParameterNames } from '../../common/search/useSearchQueryParser';
import { ObservationDateInput } from '../../forms/common';
import { ExtraFiltersToggle } from '../../stop-registry/search/components/StopSearchBar/BasicFilters/ExtraFiltersToggle';
import { LineTypeCondition } from './conditions/LineTypeCondition';
import { PriorityCondition } from './conditions/PriorityCondition';
import { TransportationModeCondition } from './conditions/TransportationModeCondition';
import { SearchQuery } from './SearchQuery';
import { SearchNavigationState } from './types/SearchNavigationState';

const testIds = {
  observationDateInput: 'SearchContainer::observationDateInput',
};

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
  const { searchConditions, setSearchCondition, handleSearch } = useSearch();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const extraFiltersId = useId();

  const [isExpanded, toggleIsExpanded] = useToggle(
    location.state?.searchExpanded,
  );

  const toggleExpand = () => {
    searchExpandChanged?.(!isExpanded);
    toggleIsExpanded();
  };

  const onChangeLabel = (value: string) => {
    setSearchCondition(SearchQueryParameterNames.Label, value);
  };

  const onChangeTypeOfLine: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchCondition(SearchQueryParameterNames.TypeOfLine, e.target.value);
  };

  const onChangeDate = (dateTime: DateTime) => {
    setSearchCondition(SearchQueryParameterNames.ObservationDate, dateTime);
  };

  const onSearch = () => {
    dispatch(resetSelectedRowsAction());
    handleSearch(generateNavigationState(isExpanded));
  };

  return (
    <Container className="py-10">
      <Row className="justify-center gap-x-4 bg-background py-4">
        <ObservationDateInput
          required
          containerClassName="min-w-40"
          value={searchConditions.observationDate}
          onChange={onChangeDate}
          testId={testIds.observationDateInput}
        />

        <SearchQuery
          className="w-4/6 xl:w-2/6"
          onChangeLabel={onChangeLabel}
          onSearch={onSearch}
          searchConditions={searchConditions}
        />

        <ExtraFiltersToggle
          className="mt-[25px]"
          extraFiltersId={extraFiltersId}
          searchIsExpanded={isExpanded}
          toggleSearchIsExpanded={toggleExpand}
          testIdPrefix="SearchContainer"
        />
      </Row>

      <Visible visible={isExpanded}>
        <div
          id={extraFiltersId}
          className="space-y-5 border-2 border-background p-10"
        >
          <h2>{t('search.advancedSearchTitle')}</h2>
          <Row className="space-x-4">
            <TransportationModeCondition
              transportationModes={searchConditions.transportMode}
              setSearchCondition={setSearchCondition}
            />

            <PriorityCondition
              onClick={setSearchCondition}
              priorities={searchConditions.priorities}
            />

            <LineTypeCondition
              value={searchConditions.typeOfLine ?? AllOptionEnum.All}
              onChange={onChangeTypeOfLine}
            />
          </Row>
        </div>
        <ExpandedSearchButtons
          testIdPrefix="SearchContainer"
          toggleExpand={toggleExpand}
          searchButtonType="button"
          onSearch={onSearch}
        />
      </Visible>
    </Container>
  );
};
