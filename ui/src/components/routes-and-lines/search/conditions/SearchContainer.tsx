import { useTranslation } from 'react-i18next';
import { SearchQueryParameterNames, useSearch } from '../../../../hooks';
import { useToggle } from '../../../../hooks/useToggle';
import { Column, Container, Row, Visible } from '../../../../layoutComponents';
import { SimpleButton } from '../../../../uiComponents';
import { AllOptionEnum } from '../../../../utils';
import { FormRow } from '../../../forms/common';
import { LineTypeDropdown } from '../../../forms/line/LineTypeDropdown';
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
    setSearchCondition(
      SearchQueryParameterNames.PrimaryVehicleMode,
      e.target.value,
    );
  };

  const onChangeTypeOfLine = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCondition(SearchQueryParameterNames.TypeOfLine, e.target.value);
  };

  const vehicleModeDropdownId = 'search.primaryVehicleMode';
  const typeOfLineDropdownId = 'search.typeOfLine';

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
        <div className="space-y-5 border-2 border-background p-10">
          <h2>{t('search.advancedSearchTitle')}</h2>
          <FormRow mdColumns={4}>
            <Column>
              <label htmlFor={vehicleModeDropdownId}>
                {t(`lines.primaryVehicleMode`)}
              </label>
              <VehicleModeDropdown
                id={vehicleModeDropdownId}
                onChange={onChangeVehiclemode}
                includeAllOption
                value={searchConditions.primaryVehicleMode ?? AllOptionEnum.All}
              />
            </Column>
            <Column>
              <label htmlFor={typeOfLineDropdownId}>
                {t(`lines.typeOfLine`)}
              </label>
              <LineTypeDropdown
                id={typeOfLineDropdownId}
                onChange={onChangeTypeOfLine}
                includeAllOption
                value={searchConditions.typeOfLine ?? AllOptionEnum.All}
              />
            </Column>
          </FormRow>
          <FormRow mdColumns={4}>
            <PriorityCondition
              onClick={setSearchCondition}
              priorities={searchConditions.priorities}
            />
          </FormRow>
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
