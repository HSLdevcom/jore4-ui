export class StopActionsDropdown {
  static getAddStopToRouteButton() {
    return cy.getByTestId('StopActionsDropdown::addStopToRouteButton');
  }

  static getRemoveStopFromRouteButton() {
    return cy.getByTestId('StopActionsDropdown::removeStopFromRouteButton');
  }

  static getCreateViaPointButton() {
    return cy.getByTestId('StopActionsDropdown::createViaPoint');
  }

  static getEditViaPointButton() {
    return cy.getByTestId('StopActionsDropdown::editViaPoint');
  }

  static getOpenTimingSettingsButton() {
    return cy.getByTestId('StopActionsDropdown::openTimingSettings');
  }
}
