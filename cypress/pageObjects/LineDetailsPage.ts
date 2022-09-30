import { UUID } from '../types';

export class LineDetailsPage {
  visit(lineId: UUID) {
    cy.visit(`/lines/${lineId}`);
  }

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

  getEditLineButton() {
    return cy.getByTestId(
      'LineDetailsPage::AdditionalInformation::editLineButton',
    );
  }

  getLineName() {
    return cy.getByTestId('LineDetailsPage::AdditionalInformation::name');
  }

  getLineValidityPeriod() {
    return cy.getByTestId('LineValidityPeriod::validityPeriod');
  }

  getLinePriority() {
    return cy.getByTestId('LineValidityPeriod::priority');
  }

  getLineLabel() {
    return cy.getByTestId('LineDetailsPage::AdditionalInformation::label');
  }
}
