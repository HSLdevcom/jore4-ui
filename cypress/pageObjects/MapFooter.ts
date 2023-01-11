import { Toast } from './Toast';

export class MapFooter {
  toast = new Toast();

  getCreateRouteButton() {
    return cy.getByTestId('MapFooter::drawRouteButton');
  }

  createRoute() {
    return this.getCreateRouteButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  addStop() {
    return cy
      .getByTestId('MapFooter:addStopButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  editRoute() {
    cy.getByTestId('MapFooter::editRouteButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
    cy.wait('@gqlGetRouteWithInfrastructureLinks');
  }

  save() {
    return cy
      .getByTestId('MapFooter::saveButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  cancel() {
    return cy
      .getByTestId('MapFooter::cancelButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }
}
