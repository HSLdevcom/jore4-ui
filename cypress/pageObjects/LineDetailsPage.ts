import { UUID } from '../types';
import { RouteStopsTable } from './RouteStopsTable';

export class LineDetailsPage {
  routeStopsTable = new RouteStopsTable();

  visit(lineId: UUID) {
    cy.visit(`/lines/${lineId}`);
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
