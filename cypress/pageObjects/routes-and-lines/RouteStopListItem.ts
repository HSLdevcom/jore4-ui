import { StopActionsDropdown } from './line-details-page/StopActionsDropdown';

export class RouteStopListItem {
  static stopActionsDropdown = StopActionsDropdown;

  static getHastusCode() {
    return cy.getByTestId('RouteStopListItem::hastusCode');
  }

  static getOpenTimingSettingsButton() {
    return cy.getByTestId('RouteStopListItem::openTimingSettingsButton');
  }

  static getViaIcon() {
    return cy.getByTestId('RouteStopListItem::viaIcon');
  }

  static getStopActionsDropdown() {
    return cy.getByTestId('StopActionsDropdown::menu');
  }
}
