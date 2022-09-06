import { UUID } from '../types';

export class LineDetailsPage {
  visit(lineId: UUID) {
    cy.visit(`/lines/${lineId}`);
  }

  toggleUnusedStops() {
    return cy.getByTestId('show-unused-stops-switch').click();
  }

  getRouteSection(routeLabel: string) {
    return cy.getByTestId(`RouteStopsHeaderRow::${routeLabel}`);
  }

  toggleRouteSection(routeLabel: string) {
    return this.getRouteSection(routeLabel)
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
}
