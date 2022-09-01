import { UUID } from '../types';

export class LineDetailsPage {
  visit(lineId: UUID) {
    cy.visit(`/lines/${lineId}`);
  }

  toggleUnusedStops() {
    return cy.getByTestId('show-unused-stops-switch').click();
  }

  getRouteSection(routeId: UUID) {
    return cy.getByTestId(`RouteStopsHeaderRow::${routeId}`);
  }

  toggleRouteSection(routeId: UUID) {
    return this.getRouteSection(routeId)
      .getByTestId('RouteStopsHeaderRow::toggleAccordion')
      .click();
  }

  getStopRow(stopId: UUID) {
    return cy.getByTestId(`RouteStopsRow::${stopId}`);
  }

  getStopDropdown(stopId: UUID) {
    return this.getStopRow(stopId).findByTestId('StopActionsDrowdown::menu');
  }

  addStopToRoute(stopId: UUID) {
    return this.getStopDropdown(stopId)
      .click()
      .getByTestId('StopActionsDrowdown::addStopToRouteButton')
      .click();
  }

  removeStopFromRoute(stopId: UUID) {
    return this.getStopDropdown(stopId)
      .click()
      .getByTestId('StopActionsDrowdown::removeStopFromRouteButton')
      .click();
  }
}
