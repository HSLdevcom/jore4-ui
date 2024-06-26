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
  }

  getSearchButton() {
    return cy.getByTestId('SearchContainer::searchButton');
  }
}
