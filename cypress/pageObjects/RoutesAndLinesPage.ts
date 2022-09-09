export class RoutesAndLinesPage {
  getRoutesAndLinesSearchInput() {
    return cy.getByTestId('SearchContainer::SearchInput');
  }
}
