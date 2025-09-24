import { MultiselectDropDown } from './MultiselectDropDown';
import { PriorityFilter } from './PriorityFilter';
import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';
import { SearchForDropdown } from './SearchForDropdown';
import { TransportationModeFilter } from './TransportationModeFilter';

export class StopSearchBar {
  municipality = new MultiselectDropDown('StopSearchBar::municipalitiesFilter');

  electricity = new MultiselectDropDown('StopSearchBar::electricityFilter');

  infoSpots = new MultiselectDropDown('StopSearchBar::infoSpotsFilter');

  priority = new PriorityFilter();

  searchCriteriaRadioButtons = new SearchCriteriaRadioButtons();

  searchForDropdown = new SearchForDropdown();

  shelters = new MultiselectDropDown('StopSearchBar::shelterFilter');

  stopState = new MultiselectDropDown('StopSearchBar::stopStateFilter');

  transportationMode = new TransportationModeFilter();

  getObservationDateInput() {
    return cy.getByTestId('StopSearchBar::observationDateInput');
  }

  getSearchInput() {
    return cy.getByTestId('StopSearchBar::searchInput');
  }

  getElyInput() {
    return cy.getByTestId('StopSearchBar::elyInput');
  }

  getExpandToggle() {
    return cy.getByTestId('StopSearchBar::chevronToggle');
  }

  getSearchButton() {
    return cy.getByTestId('StopSearchBar::searchButton');
  }
}
