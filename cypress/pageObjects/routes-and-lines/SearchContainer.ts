import { PriorityCondition } from '../forms/PriorityCondition';

export class SearchContainer {
  static priorityCondition = PriorityCondition;

  static getSearchInput() {
    return cy.getByTestId('SearchContainer::searchInput');
  }

  static getChevron() {
    return cy.getByTestId('SearchContainer::chevronToggle');
  }

  static getObservationDateInput() {
    return cy.getByTestId('SearchContainer::observationDateInput');
  }

  static setObservationDate(isoDate: string) {
    SearchContainer.getObservationDateInput().type(isoDate);
    SearchContainer.getObservationDateInput().trigger('keyup', { keyCode: 13 });
  }

  static getSearchButton() {
    return cy.getByTestId('SearchContainer::searchButton');
  }

  static getExpandedSearchButton() {
    return cy.getByTestId('SearchContainer::expandedSearchButton');
  }

  static toggleTransportationMode(mode: string) {
    return cy.getByTestId(`SearchContainer::transportationMode::${mode}`);
  }
}
