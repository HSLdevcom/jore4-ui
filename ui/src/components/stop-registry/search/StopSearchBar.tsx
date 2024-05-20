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

export const StopSearchBar = (): JSX.Element => {
  const { searchConditions, setSearchCondition, handleSearch } =
    useStopSearch();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isExpanded, toggleIsExpanded] = useToggle();
  const testIds = {
    searchInput: 'StopSearchBar::searchInput',
    toggleExpand: 'StopSearchBar::chevronToggle',
    searchButton: 'StopSearchBar::searchButton',
    elyInput: 'StopSearchBar::elyInput',
  };

  const onChangeLabel = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.Label, value);
  };

  const onChangeELY = (value: string) => {
    setSearchCondition(StopSearchQueryParameterNames.ELYNumber, value);
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
              value={searchConditions.label}
              onSearch={onSearch}
              onChange={onChangeLabel}
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
              <label htmlFor="label">{t('search.elyNumber')} </label>
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
