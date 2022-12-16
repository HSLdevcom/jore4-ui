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
      this.getRouteStop(label).should('not.exist');
    });
  }

  stopsShouldBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStop(label).should('exist');
    });
  }
}
