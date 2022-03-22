import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks/search';
import { useToggle } from '../../../../hooks/useToggle';
import { Column, Container, Row, Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { PriorityCondition } from './PriorityCondition';
import { SearchConditionToggle } from './SearchConditionsToggle';
import { SearchExpression } from './SearchExpression';

const AdvancedSearchContainer: FC = ({ children }): JSX.Element => (
  <div className="border-2 border-background p-10">{children}</div>
);

const ActionsContainer: FC = ({ children }): JSX.Element => (
  <Row className="flex justify-end bg-background py-4">{children}</Row>
);

const SearchBarContainer: FC = ({ children }): JSX.Element => (
  <Row className="justify-center bg-background py-4">{children}</Row>
);

export const SearchContainer = (): JSX.Element => {
  const { searchConditions, setSearchCondition, handleSearch } = useSearch();
  const { t } = useTranslation();

  const [isExpanded, toggleIsExpanded] = useToggle();

  return (
    <Container className="py-10">
      <SearchBarContainer>
        <Column className="w-2/4">
          <Row>
            <label htmlFor="label">{t('search.searchLabel')}</label>
          </Row>
          <Row className="space-x-4">
            <SearchExpression
              value={searchConditions.label}
              onSearch={handleSearch}
              onChange={(value) => setSearchCondition('label', value)}
            />
            <SearchConditionToggle
              isToggled={isExpanded}
              onClick={toggleIsExpanded}
            />
          </Row>
        </Column>
      </SearchBarContainer>
      <Visible visible={isExpanded}>
        <AdvancedSearchContainer>
          <h4 className="text-bold text-2xl">
            {t('search.advancedSearchTitle')}
          </h4>
          <PriorityCondition
            onClick={setSearchCondition}
            priorities={searchConditions.priorities}
          />
        </AdvancedSearchContainer>
        <ActionsContainer>
          <SimpleButton className="mr-6" inverted onClick={toggleIsExpanded}>
            {t('hide')}
          </SimpleButton>
          <SimpleButton className="mr-6" onClick={handleSearch}>
            {t('search.search')}
          </SimpleButton>
        </ActionsContainer>
      </Visible>
    </Container>
  );
};
