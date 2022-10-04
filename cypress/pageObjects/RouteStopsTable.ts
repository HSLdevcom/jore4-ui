export class RouteStopsTable {
  toggleUnusedStops() {
    return cy.getByTestId('show-unused-stops-switch').click();
  }

  getRouteHeaderRow(routeLabel: string) {
    return cy.getByTestId(`RouteStopsHeaderRow::${routeLabel}`);
  }

  toggleRouteSection(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel)
      .getByTestId('RouteStopsHeaderRow::toggleAccordion')
      .click();
  }

  getStopRow(stopLabel: string) {
    return cy.getByTestId(`RouteStopsRow::${stopLabel}`);
  }

  getStopDropdown(stopLabel: string) {
    return this.getStopRow(stopLabel).findByTestId('StopActionsDrowdown::menu');
  }

  addStopToRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDrowdown::addStopToRouteButton')
      .click();
  }

  removeStopFromRoute(stopLabel: string) {
    return this.getStopDropdown(stopLabel)
      .click()
      .getByTestId('StopActionsDrowdown::removeStopFromRouteButton')
      .click();
  }

  getRouteName() {
    return cy.getByTestId('RouteStopsHeaderRow::name');
  }

  getRouteValidityPeriod(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel).findByTestId(
      'RouteStopsHeaderRow::validityPeriod',
    );
  }

  getRouteDirection(routeLabel: string) {
    return this.getRouteHeaderRow(routeLabel).findByTestId(
      'DirectionBadge::value',
    );
  }

  routeDirectionShouldBeOutbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '1');
  }

  routeDirectionShouldBeInbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '2');
  }
}
