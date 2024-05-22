import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  StopSearchQueryParameterNames,
  useStopSearch,
  useToggle,
} from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { ChevronToggle, SimpleButton } from '../../../uiComponents';
import { SearchInput } from '../../common';
import {
  SearchBy,
  SearchCriteriaRadioButtons,
  isSearchBy,
} from './SearchCriteriaRadioButtons';

const testIds = {
  searchInput: 'StopSearchBar::searchInput',
  toggleExpand: 'StopSearchBar::chevronToggle',
  searchButton: 'StopSearchBar::searchButton',
  elyInput: 'StopSearchBar::elyInput',
};

export const StopSearchBar = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    searchConditions,
    setSearchInputValue,
    setSearchCondition,
    setMultipleSearchConditions,
    handleSearch,
  } = useStopSearch();

  const [isExpanded, toggleIsExpanded] = useToggle();

  const onChangeELY = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.ELYNumber, value);
  };

  const [searchBy, setSearchBy] = useState<SearchBy>('label');

  const handleSearchByChange = (value: string) => {
    const oldValue = searchConditions[searchBy];
    setMultipleSearchConditions({
      [searchBy]: '',
      [value]: oldValue,
    });
    setSearchBy(value as SearchBy);
  };

  const onSearchInputChange = (value: string) => {
    setSearchInputValue(searchBy, value);
  };

  const onSearch = () => {
    dispatch(resetSelectedRowsAction());
    handleSearch();
  };

  useEffect(() => {
    Object.entries(searchConditions).forEach(([key, value]) => {
      if (isSearchBy(key) && !isEmpty(value)) {
        setSearchBy(key);
        setSearchInputValue(key, value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-10">
      <Row className="justify-center bg-background py-4">
        <Column className="w-2/4">
          <Row>
            <label htmlFor="label">{t('search.searchLabel')}</label>
          </Row>
          <Row className="space-x-4">
            <SearchInput
              testId={testIds.searchInput}
              value={searchConditions[searchBy]}
              onSearch={onSearch}
              onChange={onSearchInputChange}
            />
            <ChevronToggle
              testId={testIds.toggleExpand}
              isToggled={isExpanded}
              onClick={toggleIsExpanded}
              controls="advanced-search"
              openTooltip={t('accessibility:common.expandSearch')}
              closeTooltip={t('accessibility:common.closeSearch')}
            />
          </Row>
          <Row className="space-x-4 py-4">
            <SearchCriteriaRadioButtons
              handleSearchByChange={handleSearchByChange}
              searchBy={searchBy}
            />
          </Row>
        </Column>
      </Row>
      <Visible visible={isExpanded}>
        <div
          id="advanced-search"
          className="space-y-5 border-2 border-background p-10"
        >
          <h2>{t('search.advancedSearchTitle')}</h2>
          <Row className="space-x-4">
            <Column className="w-1/6">
              <label htmlFor="label">{t('stopRegistrySearch.elyNumber')}</label>
              <input
                data-testid={testIds.elyInput}
                className="flex-1"
                type="text"
                value={searchConditions.elyNumber}
                onChange={(e) => onChangeELY(e.target.value)}
              />
            </Column>
          </Row>
        </div>
        <Row className="flex justify-end bg-background py-4">
          <SimpleButton
            containerClassName="mr-6"
            inverted
            onClick={toggleIsExpanded}
          >
            {t('hide')}
          </SimpleButton>
          <SimpleButton
            containerClassName="mr-6"
            onClick={handleSearch}
            testId={testIds.searchButton}
          >
            {t('search.search')}
          </SimpleButton>
        </Row>
      </Visible>
    </Container>
  );
};
