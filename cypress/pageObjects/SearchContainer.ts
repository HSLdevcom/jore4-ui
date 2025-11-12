import { PriorityCondition } from './PriorityCondition';

export class SearchContainer {
  priorityCondition = new PriorityCondition();

  getSearchInput() {
    return cy.getByTestId('SearchContainer::searchInput');
  }

  getChevron() {
    return cy.getByTestId('SearchContainer::chevronToggle');
  }

  getObservationDateInput() {
    return cy.getByTestId('SearchContainer::observationDateInput');
  }

  setObservationDate(isoDate: string) {
    this.getObservationDateInput().type(isoDate);
    this.getObservationDateInput().trigger('keyup', { keyCode: 13 });
  }

  getSearchButton() {
    return cy.getByTestId('SearchContainer::searchButton');
  }

  getExpandedSearchButton() {
    return cy.getByTestId('SearchContainer::expandedSearchButton');
  }

  toggleTransportationMode(mode: string) {
    return cy.getByTestId(`SearchContainer::transportationMode::${mode}`);
  }
}
