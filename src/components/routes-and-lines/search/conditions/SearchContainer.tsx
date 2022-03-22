import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks/search/useSearch';
import { useToggle } from '../../../../hooks/useToggle';
import { Container, Row } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { PriorityCondition } from './PriorityCondition';
import { SearchBarContainer } from './SearchBarContainer';

const AdvancedSearchContainer: FC = ({ children }) => (
  <div style={{ borderColor: '#f2f5f7' }} className="border-2 p-10">
    {children}
  </div>
);

const ActionsContainer: FC = ({ children }) => (
  <Row className="flex justify-end bg-background py-4">{children}</Row>
);

export const SearchContainer = (): JSX.Element => {
  const { searchConditions, setSearchCondition, handleSearch } = useSearch();
  const { t } = useTranslation();

  const [isExpanded, toggleExpanded] = useToggle();

  return (
    <Container className="pt-10 pb-10">
      <SearchBarContainer
        isToggled={isExpanded}
        onToggle={toggleExpanded}
        onSearch={handleSearch}
        onChange={setSearchCondition}
        value={searchConditions.label}
      />
      {isExpanded && (
        <>
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
            <SimpleButton className="mr-6" inverted onClick={toggleExpanded}>
              {t('hide')}
            </SimpleButton>

            <SimpleButton className="mr-6" onClick={handleSearch}>
              {t('search.search')}
            </SimpleButton>
          </ActionsContainer>
        </>
      )}
    </Container>
  );
};
