import { UUID } from '../types';
import { LineValidityPeriod } from './LineValidityPeriod';
import { RouteStopsTable } from './RouteStopsTable';

export class LineDetailsPage {
  routeStopsTable = new RouteStopsTable();

  lineValidityPeriod = new LineValidityPeriod();

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

  getLineLabel() {
    return cy.getByTestId('LineDetailsPage::AdditionalInformation::label');
  }

  getTypeOfLine() {
    return cy.getByTestId('LineDetailsPage::AdditionalInformation::typeOfLine');
  }

  getTransportTarget() {
    return cy.getByTestId(
      'LineDetailsPage::AdditionalInformation::transportTarget',
    );
  }

  getPrimaryVehicleMode() {
    return cy.getByTestId(
      'LineDetailsPage::AdditionalInformation::primaryVehicleMode',
    );
  }
}
