import { MultiselectDropDown } from './MultiselectDropDown';
import { PriorityFilter } from './PriorityFilter';
import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';
import { SearchForDropdown } from './SearchForDropdown';
import { TransportationModeFilter } from './TransportationModeFilter';

export class StopSearchBar {
  static municipality = new MultiselectDropDown(
    'StopSearchBar::municipalitiesFilter',
  );

  static electricity = new MultiselectDropDown(
    'StopSearchBar::electricityFilter',
  );

  static infoSpots = new MultiselectDropDown('StopSearchBar::infoSpotsFilter');

  static priority = new PriorityFilter();

  static searchCriteriaRadioButtons = new SearchCriteriaRadioButtons();

  static searchForDropdown = new SearchForDropdown();

  static shelters = new MultiselectDropDown('StopSearchBar::shelterFilter');

  static stopState = new MultiselectDropDown('StopSearchBar::stopStateFilter');

  static stopOwner = new MultiselectDropDown('StopSearchBar::stopOwnerFilter');

  static transportationMode = new TransportationModeFilter();

  static getObservationDateInput() {
    return cy.getByTestId('StopSearchBar::observationDateInput');
  }

  static getSearchInput() {
    return cy.getByTestId('StopSearchBar::searchInput');
  }

  static getElyInput() {
    return cy.getByTestId('StopSearchBar::elyInput');
  }

  static getExpandToggle() {
    return cy.getByTestId('StopSearchBar::chevronToggle');
  }

  static getSearchButton() {
    return cy.getByTestId('StopSearchBar::searchButton');
  }
}
