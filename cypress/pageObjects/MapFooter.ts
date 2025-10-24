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
      .getByTestId('MapFooter::closeButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  getStopResultsFooter() {
    return cy.getByTestId('StopResultsFooter');
  }

  getStopResultsFooterCloseButton() {
    // Assume the button is going to be clicked.
    // Allow the browser to flush the event queue, and the Map & React to
    // settle down and finish any pending Router navigation state changes,
    // before navigating back to previous page.

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1);

    return cy.getByTestId('StopResultsFooter::closeButton');
  }
}
