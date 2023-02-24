import { PriorityCondition } from './PriorityCondition';

export class SearchContainer {
  priorityCondition = new PriorityCondition();

  getSearchInput() {
    return cy.getByTestId('SearchContainer::SearchInput');
  }

  getChevron() {
    return cy.getByTestId('SearchContainer::ChevronToggle');
  }
}
