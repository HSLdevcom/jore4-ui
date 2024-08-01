import { UUID } from '../types';
import { LineRouteList } from './LineRouteList';
import { LineValidityPeriod } from './LineValidityPeriod';

export class LineDetailsPage {
  lineRouteList = new LineRouteList();

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

  getShowDraftsButton() {
    return cy.getByTestId('ActionsRow::showDraftsButton');
  }
}
