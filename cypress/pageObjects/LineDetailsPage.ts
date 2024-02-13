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
    return cy.getByTestId('AdditionalInformation::editLineButton');
  }

  getLineName() {
    return cy.getByTestId('AdditionalInformation::name');
  }

  getLineLabel() {
    return cy.getByTestId('AdditionalInformation::label');
  }

  getTypeOfLine() {
    return cy.getByTestId('AdditionalInformation::typeOfLine');
  }

  getTransportTarget() {
    return cy.getByTestId('AdditionalInformation::transportTarget');
  }

  getPrimaryVehicleMode() {
    return cy.getByTestId('AdditionalInformation::primaryVehicleMode');
  }
}
