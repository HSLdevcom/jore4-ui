import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../../hooks';
import { useToggle } from '../../../../hooks/useToggle';
import { Column, Container, Row, Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { AllOptionEnum } from '../../../../utils';
import { FormColumn, FormRow } from '../../../forms/common';
import { VehicleModeDropdown } from '../../../forms/line/VehicleModeDropdown';
import { PriorityCondition } from './PriorityCondition';
import { SearchConditionToggle } from './SearchConditionsToggle';
import { SearchInput } from './SearchInput';

export const SearchContainer = (): JSX.Element => {
  const { searchConditions, setSearchCondition, handleSearch } = useSearch();
  const { t } = useTranslation();

  const [isExpanded, toggleIsExpanded] = useToggle();
  const testIds = {
    searchInput: 'SearchContainer::SearchInput',
  };

  const onChangeVehiclemode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCondition('primaryVehicleMode', e.target.value);
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
              onChange={(value) => setSearchCondition('label', value)}
            />
            <SearchConditionToggle
              isToggled={isExpanded}
              onClick={toggleIsExpanded}
            />
          </Row>
        </Column>
      </Row>
      <Visible visible={isExpanded}>
        <div className="border-2 border-background p-10">
          <h2>{t('search.advancedSearchTitle')}</h2>
          <FormColumn>
            <FormRow mdColumns={4}>
              <FormColumn>
                <label htmlFor="search.primaryVehicleMode">
                  {t(`lines.primaryVehicleMode`)}
                </label>
                <VehicleModeDropdown
                  id="search.primaryVehicleMode"
                  onChange={onChangeVehiclemode}
                  includeAllOption
                  value={
                    searchConditions.primaryVehicleMode ?? AllOptionEnum.All
                  }
                />
              </FormColumn>
            </FormRow>
            <FormRow mdColumns={4}>
              <PriorityCondition
                onClick={setSearchCondition}
                priorities={searchConditions.priorities}
              />
            </FormRow>
          </FormColumn>
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
