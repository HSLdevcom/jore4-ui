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

  getRoutesResultsButton() {
    return cy.getByTestId('ResultSelector::routes');
  }

  getLinesResultsButton() {
    return cy.getByTestId('ResultSelector::lines');
  }

  getShowRouteOnMapButton() {
    return cy.getByTestId('RouteTableRow::showRoute');
  }
}
