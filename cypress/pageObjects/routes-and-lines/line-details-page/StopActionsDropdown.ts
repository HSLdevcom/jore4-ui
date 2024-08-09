export class StopActionsDropdown {
  getAddStopToRouteButton() {
    return cy.getByTestId('StopActionsDropdown::addStopToRouteButton');
  }

  getRemoveStopFromRouteButton() {
    return cy.getByTestId('StopActionsDropdown::removeStopFromRouteButton');
  }

  getCreateViaPointButton() {
    return cy.getByTestId('StopActionsDropdown::createViaPoint');
  }

  getEditViaPointButton() {
    return cy.getByTestId('StopActionsDropdown::editViaPoint');
  }

  getOpenTimingSettingsButton() {
    return cy.getByTestId('StopActionsDropdown::openTimingSettings');
  }
}
