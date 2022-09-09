export class RoutesAndLinesSearchResultsPage {
  getRoutesSearchResultTable() {
    return cy.getByTestId('RoutesList::table');
  }

  getLinesSearchResultTable() {
    return cy.getByTestId('LinesList::table');
  }
}
