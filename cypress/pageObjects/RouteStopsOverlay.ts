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

  removeStopsFromRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStopRowMenu(label).should('exist');
      this.getRouteStopRowMenu(label).click();
      this.getAddToJourneyPatternButton(label).should('exist');
      this.getAddToJourneyPatternButton(label).click();
    });
  }

  stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStop(label).should('not.exist');
    });
  }
}
