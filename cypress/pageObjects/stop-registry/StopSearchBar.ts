import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';

export class StopSearchBar {
  searchCriteriaRadioButtons = new SearchCriteriaRadioButtons();

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
