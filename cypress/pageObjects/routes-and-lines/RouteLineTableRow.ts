export class RouteLineTableRow {
  static getRouteLineTableRowCheckbox(routeLineTestId: string) {
    return cy.getByTestId(`RouteLineTableRow::checkbox::${routeLineTestId}`);
  }
}
