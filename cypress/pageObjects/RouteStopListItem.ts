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

  getStopActionsDropdown() {
    return cy.getByTestId('StopActionsDropdown::menu');
  }
}
