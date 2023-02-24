export class RouteLineTableRow {
  getRouteLineTableRowCheckbox(routeLineTestId: string) {
    return cy.getByTestId(`RouteLineTableRow::checkbox::${routeLineTestId}`);
  }
}
