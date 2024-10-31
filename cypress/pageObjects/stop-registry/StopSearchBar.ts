import { SearchCriteriaRadioButtons } from './SearchCriteriaRadioButtons';
import { SearchForDropdown } from './SearchForDropdown';

export class StopSearchBar {
  searchCriteriaRadioButtons = new SearchCriteriaRadioButtons();

  searchForDropdown = new SearchForDropdown();

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

  getMunicipalitiesOptions() {
    return cy.getByTestId(
      'StopSearchBar::municipalitiesDropdown::ListboxOptions',
    );
  }

  openMunicipalityDropdown() {
    this.getMunicipalitiesDropdown().click();
  }

  toggleMunicipality(municipality: string) {
    this.getMunicipalitiesOptions().contains(municipality).click();
  }

  isMunicipalitySelected(municipality: string) {
    this.getMunicipalitiesOptions()
      .contains(municipality)
      .get('input')
      .should('be.checked');
  }
}
