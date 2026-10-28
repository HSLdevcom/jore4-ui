import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export class MapFooter {
  static getMapFooter() {
    return cy.getByTestId('MapFooter::mapFooter');
  }

  static getCreateRouteButton() {
    return cy.getByTestId('MapFooter::drawRouteButton');
  }

  static getEditRouteButton() {
    return cy.getByTestId('MapFooter::editRouteButton');
  }

  static getDeleteRouteGeometryButton() {
    return cy.getByTestId('MapFooter::deleteRouteGeometryButton');
  }

  static getDeleteRouteButton() {
    return cy.getByTestId('MapFooter::deleteRouteButton');
  }

  static getSaveButton() {
    return cy.getByTestId('MapFooter::saveButton');
  }

  static redrawRoute() {
    return MapFooter.getCreateRouteButton()
      .should('have.text', 'Vedä reitti uudelleen')
      .and('be.visible')
      .and('be.enabled')
      .click();
  }

  static createRoute(
    vehicleMode: ReusableComponentsVehicleModeEnum = ReusableComponentsVehicleModeEnum.Bus,
  ) {
    MapFooter.getCreateRouteButton()
      .should('be.visible')
      .and('be.enabled')
      .click();

    return cy
      .get(`[data-vehicle-mode="${vehicleMode}"]`)
      .should('be.visible')
      .click();
  }

  static addStop(
    vehicleMode: ReusableComponentsVehicleModeEnum = ReusableComponentsVehicleModeEnum.Bus,
  ) {
    cy.getByTestId('MapFooter:addStopButton')
      .should('be.visible')
      .and('be.enabled')
      .click();

    return cy
      .get(`[data-vehicle-mode="${vehicleMode}"]`)
      .should('be.visible')
      .click();
  }

  static addDepotStop() {
    cy.getByTestId('MapFooter:addStopButton')
      .should('be.visible')
      .and('be.enabled')
      .click();

    return cy
      .getByTestId('AddStopDropdownOption::addDepotStop')
      .should('be.visible')
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
    MapFooter.getEditRouteButton()
      .should('be.visible')
      .and('be.enabled')
      .click();
  }

  static save() {
    return MapFooter.getSaveButton()
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
