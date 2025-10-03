import { Toast } from './Toast';

export class MapFooter {
  toast = new Toast();

  getMapFooter() {
    return cy.getByTestId('MapFooter::mapFooter');
  }

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

  addStopArea() {
    cy.getByTestId('MapFooterActionsDropdown::menu')
      .should('be.visible')
      .click();

    cy.getByTestId('MapFooterActionsDropdown::createNewStopArea')
      .should('be.visible')
      .click();
  }

  addTerminal() {
    cy.getByTestId('MapFooterActionsDropdown::menu')
      .should('be.visible')
      .click();

    cy.getByTestId('MapFooterActionsDropdown::createNewTerminal')
      .should('be.visible')
      .click();
  }

  editRoute() {
    cy.getByTestId('MapFooter::editRouteButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
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

  cancelAddMode() {
    return cy
      .getByTestId('MapFooter::cancelAddModeButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }
}
