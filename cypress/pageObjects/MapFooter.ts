export class MapFooter {
  createRoute() {
    return cy.getByTestId('mapFooter:drawRouteButton').click();
  }

  editRoute() {
    return cy.getByTestId('mapFooter:editRouteButton').click();
  }

  save() {
    return cy.getByTestId('mapFooter:saveButton').click();
  }

  cancel() {
    return cy.getByTestId('mapFooter:cancelButton').click();
  }
}
