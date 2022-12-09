export class RouteStopsOverlay {
  getRouteStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::label::${stopLabel}`);
  }

  getHeader() {
    return cy.getByTestId('RouteStopsOverlay::mapOverlayHeader');
  }

  getRouteStopRowMenu(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::${stopLabel}::menu`);
  }

  getAddToJourneyPatternButton(stopLabel: string) {
    return cy.getByTestId(
      `RouteStopsOverlayRow::${stopLabel}::menu::addToJourneyPatternButton`,
    );
  }

  routeShouldBeSelected(routeName: string) {
    return this.getHeader().get('div').contains(routeName).should('exist');
  }

  removeStopsFromRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRowMenu(label).should('be.visible');
      this.getRouteStopRowMenu(label).click();
      this.getAddToJourneyPatternButton(label).should('be.visible');
      this.getAddToJourneyPatternButton(label).click({ force: true });
    });
  }

  stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRow(label).should('not.exist');
    });
  }

  stopsShouldBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRow(label).should('exist');
    });
  }

  assertRouteStopCount(expectedCount: number) {
    return cy
      .get('[data-testid^="RouteStopsOverlayRow::label"')
      .should('have.length', expectedCount);
  }
}
