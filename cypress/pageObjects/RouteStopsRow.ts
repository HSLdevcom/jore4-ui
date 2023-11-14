export class RouteStopsRow {
  getStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsRow::${stopLabel}`);
  }

  getOpenTimingSettingsButton() {
    return cy.getByTestId('RouteStopsRow::openTimingSettingsButton');
  }

  openStopTimingSettings(stopLabel: string) {
    return this.getStopRow(stopLabel).within(() => {
      this.getOpenTimingSettingsButton().click();
    });
  }

  getStopDropdown(stopLabel: string) {
    return this.getStopRow(stopLabel).findByTestId('StopActionsDropdown::menu');
  }

  addStopToRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDropdown::addStopToRouteButton')
      .click();
  }

  removeStopFromRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDropdown::removeStopFromRouteButton')
      .click();
  }

  openCreateViaPointModal(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDropdown::createViaPoint').click();
  }

  openEditViaPointModal(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDropdown::editViaPoint').click();
  }

  openTimingSettingsForm(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDropdown::openTimingSettings').click();
  }
}
