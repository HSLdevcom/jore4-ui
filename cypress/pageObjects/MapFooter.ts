import { Toast } from './Toast';

export class MapFooter {
  toast = new Toast();

  createRoute() {
    return cy.getByTestId('MapFooter::drawRouteButton').click();
  }

  addStop() {
    return cy.getByTestId('MapFooter:addStopButton').click();
  }

  editRoute() {
    return cy.getByTestId('MapFooter::editRouteButton').click();
  }

  save() {
    return cy.getByTestId('MapFooter::saveButton').click();
  }

  cancel() {
    return cy.getByTestId('MapFooter::cancelButton').click();
  }
}
