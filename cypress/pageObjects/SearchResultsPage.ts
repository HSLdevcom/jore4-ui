export class SearchResultsPage {
  getRoutesSearchResultTable() {
    return cy.getByTestId('RoutesList::table');
  }

  getLinesSearchResultTable() {
    return cy.getByTestId('LinesList::table');
  }

  getSearchResultsContainer() {
    return cy.getByTestId('SearchResultsPage::Container');
  }
}
