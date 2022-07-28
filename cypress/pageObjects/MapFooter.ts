import { Toast } from './Toast';

export class MapFooter {
  toast = new Toast();

  createRoute() {
    return cy.getByTestId('mapFooter:drawRouteButton').click();
  }

  addStop() {
    return cy.getByTestId('mapFooter:addStopButton').click();
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
