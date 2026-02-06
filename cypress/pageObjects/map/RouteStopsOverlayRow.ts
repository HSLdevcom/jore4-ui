export class RouteStopsOverlayRow {
  static getMenuButton() {
    return cy.getByTestId(`RouteStopsOverlayRow::menu`);
  }

  static getToggleStopInJourneyPatternButton() {
    return cy.getByTestId(
      `RouteStopsOverlayRow::menu::toggleStopInJourneyPatternButton`,
    );
  }
}
