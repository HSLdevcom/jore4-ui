export class MapFooter {
  static getMapFooter() {
    return cy.getByTestId('MapFooter::mapFooter');
  }

  static getCreateRouteButton() {
    return cy.getByTestId('MapFooter::drawRouteButton');
  }

  static createRoute() {
    return MapFooter.getCreateRouteButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static addStop() {
    return cy
      .getByTestId('MapFooter:addStopButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static addStopArea() {
    cy.getByTestId('MapFooterActionsDropdown::menu')
      .should('be.visible')
      .click();

    cy.getByTestId('MapFooterActionsDropdown::createNewStopArea')
      .should('be.visible')
      .click();
  }

  static addTerminal() {
    cy.getByTestId('MapFooterActionsDropdown::menu')
      .should('be.visible')
      .click();

    cy.getByTestId('MapFooterActionsDropdown::createNewTerminal')
      .should('be.visible')
      .click();
  }

  static editRoute() {
    cy.getByTestId('MapFooter::editRouteButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static save() {
    return cy
      .getByTestId('MapFooter::saveButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static cancel() {
    return cy
      .getByTestId('MapFooter::cancelButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static cancelAddMode() {
    return cy
      .getByTestId('MapFooter::closeButton')
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static getStopResultsFooter() {
    return cy.getByTestId('StopResultsFooter');
  }

  static getStopResultsFooterCloseButton() {
    // Assume the button is going to be clicked.
    // Allow the browser to flush the event queue, and the Map & React to
    // settle down and finish any pending Router navigation state changes,
    // before navigating back to previous page.

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1);

    return cy.getByTestId('StopResultsFooter::closeButton');
  }
}
