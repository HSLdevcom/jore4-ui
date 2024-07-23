export class RouteStopsOverlayRow {
  getMenuButton() {
    return cy.getByTestId(`RouteStopsOverlayRow::menu`);
  }

  getToggleStopInJourneyPatternButton() {
    return cy.getByTestId(
      `RouteStopsOverlayRow::menu::toggleStopInJourneyPatternButton`,
    );
  }
}
