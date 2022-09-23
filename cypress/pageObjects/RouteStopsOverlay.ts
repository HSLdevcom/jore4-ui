export class RouteStopsOverlay {
  getRouteStop(stopLabel: string) {
    return cy.getByTestId(`RouteStopsOverlayRow::${stopLabel}`);
  }

  routeShouldExist(routeName: string) {
    return cy
      .getByTestId('RouteStopsOverlay::mapOverlayHeader')
      .get('div')
      .contains(routeName)
      .should('exist');
  }

  removeStopsFromRoute(stopLabels: string[]) {
    stopLabels.forEach((element) => {
      this.getRouteStop(element).find('button').click();
      cy.get('button').contains('Poista reitin käytöstä').click();
    });
  }

  stopsShouldNotBeIncludedInRoute(stopLabels: string[]) {
    stopLabels.forEach((label) => {
      this.getRouteStop(label).should('not.exist');
    });
  }
}
