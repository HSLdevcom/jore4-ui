import { ObservationDateControl } from '../ObservationDateControl';
import {
  TerminalDetailsSection,
  TerminalLocationDetailsSection,
} from './terminals';
import { TitleRow } from './terminals/TitleRow';

export class TerminalDetailsPage {
  terminalDetails = new TerminalDetailsSection();

  locationDetails = new TerminalLocationDetailsSection();

  titleRow = new TitleRow();

  observationDateControl = new ObservationDateControl();

  visit(id: string) {
    cy.visit(`/stop-registry/terminals/${id}`);
  }

  page() {
    return cy.getByTestId('TerminalDetailsPage::page');
  }

  validityPeriod() {
    return cy.getByTestId('TerminalVersioningRow::validityPeriod');
  }
}
