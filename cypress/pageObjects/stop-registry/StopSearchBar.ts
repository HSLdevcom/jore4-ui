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

  getMunicipalitiesDropdown() {
    return cy.getByTestId(
      'StopSearchBar::municipalitiesDropdown::ListboxButton',
    );
  }

  openMunicipalityDropdown() {
    this.getMunicipalitiesDropdown().click();
  }

  clickMunicipality(municipality: string) {
    cy.get('li').contains(municipality).click();
  }

  isMunicipalitySelected(municipality: string) {
    cy.get('li').contains(municipality).get('input').should('be.checked');
  }
}
