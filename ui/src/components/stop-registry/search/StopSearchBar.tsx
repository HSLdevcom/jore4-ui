import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  StopSearchQueryParameterNames,
  useStopSearch,
  useToggle,
} from '../../../hooks';
import { mapMunicipalityToUiName } from '../../../i18n/uiNameMappings';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { StopRegistryMunicipality } from '../../../types/enums';
import { ChevronToggle, SimpleButton } from '../../../uiComponents';
import { SearchInput } from '../../common';
import { EnumMultiSelectDropdown } from '../../forms/common/EnumMultiSelectDropdown';
import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';

const testIds = {
  searchInput: 'StopSearchBar::searchInput',
  toggleExpand: 'StopSearchBar::chevronToggle',
  searchButton: 'StopSearchBar::searchButton',
  elyInput: 'StopSearchBar::elyInput',
  municipalitiesDropdown: 'StopSearchBar::municipalitiesDropdown',
};

export const StopSearchBar = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const firstRender = useRef(true);
  const { searchConditions, setSearchCondition, handleSearch } =
    useStopSearch();

  useEffect(() => {
    if (!firstRender.current && searchConditions.searchKey) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRender, searchConditions.searchBy]);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  const [isExpanded, toggleIsExpanded] = useToggle();

  const onChangeELY = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.ELYNumber, value);
  };

  const onChangeSearchKey = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.SearchKey, value);
  };

  const onChangeSearchBy = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.searchBy, value);
  };

  const onChangeMunicipalities = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.Municipalities, value);
  };

  const onSearch = () => {
    dispatch(resetSelectedRowsAction());
    handleSearch();
  };

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
              value={searchConditions.searchKey}
              onSearch={onSearch}
              onChange={onChangeSearchKey}
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
          <Row className="py-4">
            <SearchCriteriaRadioButtons
              handleSearchByChange={onChangeSearchBy}
              searchBy={searchConditions.searchBy}
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
            <Column className="w-1/6">
              <label htmlFor="label">
                {t('stopRegistrySearch.municipality')}
              </label>
              <EnumMultiSelectDropdown<StopRegistryMunicipality>
                enumType={StopRegistryMunicipality}
                onChange={(e) => onChangeMunicipalities(e.target.value)}
                placeholder={t('stopRegistrySearch.municipalityPlaceholder')}
                uiNameMapper={mapMunicipalityToUiName}
                testId={testIds.municipalitiesDropdown}
                value={searchConditions.municipalities}
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
