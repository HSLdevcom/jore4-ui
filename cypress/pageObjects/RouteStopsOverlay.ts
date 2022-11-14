export class RouteStopsOverlay {
  getRouteStop(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::${stopLabel}`);
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

  routeShouldExist(routeName: string) {
    return this.getHeader().get('div').contains(routeName).should('exist');
  }

  // Note: array of stopLabels should be ordered so that the lowest one is listed first.
  // This way the upper menu does not cover the lower stop's menu button.
  // TODO: Enforce this somehow in the code, or find out root cause of failure in CI.
  removeStopsFromRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRowMenu(label).should('exist');
      this.getRouteStopRowMenu(label).should('be.visible');
      this.getRouteStopRowMenu(label).click();
      this.getAddToJourneyPatternButton(label).should('exist');
      this.getAddToJourneyPatternButton(label).should('be.visible');
      this.getAddToJourneyPatternButton(label).click({ force: true });
    });
  }

  stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStop(label).should('not.exist');
    });
  }
}
