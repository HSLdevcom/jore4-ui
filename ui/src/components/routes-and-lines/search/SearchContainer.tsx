import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import {
  SearchQueryParameterNames,
  useSearch,
  useToggle,
} from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { ChevronToggle, SimpleButton } from '../../../uiComponents';
import { AllOptionEnum } from '../../../utils';
import { SearchInput } from '../../common/search';
import { FormRow, ObservationDateInput } from '../../forms/common';
import { LineTypeDropdown } from '../../forms/line/LineTypeDropdown';
import { VehicleModeDropdown } from '../../forms/line/VehicleModeDropdown';
import { PriorityCondition } from './conditions/PriorityCondition';
import { SearchNavigationState } from './types/SearchNavigationState';

const testIds = {
  searchInput: 'SearchContainer::searchInput',
  toggleExpand: 'SearchContainer::chevronToggle',
  observationDateInput: 'SearchContainer::observationDateInput',
  searchButton: 'SearchContainer::searchButton',
};

const generateNavigationState = (
  isExpanded: boolean,
): SearchNavigationState => {
  return {
    searchExpanded: isExpanded,
  };
};

export const SearchContainer = (): React.ReactElement => {
  const { searchConditions, setSearchCondition, handleSearch } = useSearch();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isExpanded, toggleIsExpanded] = useToggle(
    location.state?.searchExpanded,
  );

  const onChangeLabel = (value: string) => {
    setSearchCondition(SearchQueryParameterNames.Label, value);
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

  const onChangeDate = (dateTime: DateTime) => {
    setSearchCondition(SearchQueryParameterNames.ObservationDate, dateTime);
  };

  const onSearch = () => {
    dispatch(resetSelectedRowsAction());
    handleSearch(generateNavigationState(isExpanded));
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
            <Column className="justify-self-end">
              <Row className="flex-1">
                <ObservationDateInput
                  value={searchConditions.observationDate}
                  onChange={onChangeDate}
                  required
                  testId={testIds.observationDateInput}
                />
              </Row>
            </Column>
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
          <SimpleButton
            containerClassName="mr-6"
            onClick={() => handleSearch(generateNavigationState(isExpanded))}
            testId={testIds.searchButton}
          >
            {t('search.search')}
          </SimpleButton>
        </Row>
      </Visible>
    </Container>
  );
};
