import { StopActionsDropdown } from './routes-and-lines/line-details-page/StopActionsDropdown';

export class RouteStopListItem {
  stopActionsDropdown = new StopActionsDropdown();

  getHastusCode() {
    return cy.getByTestId('RouteStopListItem::hastusCode');
  }

  getOpenTimingSettingsButton() {
    return cy.getByTestId('RouteStopListItem::openTimingSettingsButton');
  }

  getViaIcon() {
    return cy.getByTestId('RouteStopListItem::viaIcon');
  }

  // TODO: this should be on parent
  getStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopListItem::container::${stopLabel}`);
  }

  getStopDropdown(stopLabel: string) {
    return this.getStopRow(stopLabel).findByTestId('StopActionsDropdown::menu');
  }

  getStopActionsDropdown() {
    return cy.getByTestId('StopActionsDropdown::menu');
  }

  openTimingSettingsForm(stopLabel: string) {
    this.getStopDropdown(stopLabel).click();
    cy.getByTestId('StopActionsDropdown::openTimingSettings').click();
  }
}
