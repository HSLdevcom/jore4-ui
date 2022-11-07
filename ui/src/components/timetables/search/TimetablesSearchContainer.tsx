import { useTranslation } from 'react-i18next';
import { SearchQueryParameterNames, useSearch } from '../../../hooks';
import { useToggle } from '../../../hooks/useToggle';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { ChevronToggle, SimpleButton } from '../../../uiComponents';
import { SearchInput } from '../../common/search/SearchInput';

export const TimetablesSearchContainer = (): JSX.Element => {
  const { searchConditions, setSearchCondition, handleSearch } = useSearch({
    basePath: Path.timetables,
  });
  const { t } = useTranslation();

  const [isExpanded, toggleIsExpanded] = useToggle();
  const testIds = {
    searchInput: 'SearchContainer::SearchInput',
  };

  const onChangeLabel = (value: string) => {
    setSearchCondition(SearchQueryParameterNames.Label, value);
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
              onSearch={handleSearch}
              onChange={onChangeLabel}
            />
            <ChevronToggle isToggled={isExpanded} onClick={toggleIsExpanded} />
          </Row>
        </Column>
      </Row>
      <Visible visible={isExpanded}>
        <div className="space-y-5 border-2 border-background p-10">
          <h2>{t('search.advancedSearchTitle')}</h2>
          Nothing here yet..
        </div>
        <Row className="flex justify-end bg-background py-4">
          <SimpleButton
            containerClassName="mr-6"
            inverted
            onClick={toggleIsExpanded}
          >
            {t('hide')}
          </SimpleButton>
          <SimpleButton containerClassName="mr-6" onClick={handleSearch}>
            {t('search.search')}
          </SimpleButton>
        </Row>
      </Visible>
    </Container>
  );
};
