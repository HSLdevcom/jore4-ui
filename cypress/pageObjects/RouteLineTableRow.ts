export class RouteLineTableRow {
  getRouteLineTableRowCheckbox(labelWithVariant: string) {
    return cy.getByTestId(`RouteLineTableRow::checkbox::${labelWithVariant}`);
  }
}
