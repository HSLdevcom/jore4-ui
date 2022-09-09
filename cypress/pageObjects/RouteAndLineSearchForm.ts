export class RouteAndLineSearchForm {
  getRouteSearchFormSearchField() {
    return cy.getByTestId('SearchContainer::SearchInput');
  }

  getRouteSearchResultTable() {
    return cy.getByTestId('RoutesTable');
  }

  getLineSearchResultTable() {
    return cy.getByTestId('LinesTable');
  }
}
