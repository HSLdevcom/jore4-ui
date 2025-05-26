import { ObservationDateControl } from '../ObservationDateControl';
import {
  TerminalDetailsSection,
  TerminalLocationDetailsSection,
} from './terminals';
import { TerminalVersioningRow } from './terminals/TerminalVersioningRow';
import { TitleRow } from './terminals/TitleRow';

export class TerminalDetailsPage {
  terminalDetails = new TerminalDetailsSection();

  locationDetails = new TerminalLocationDetailsSection();

  titleRow = new TitleRow();

  versioningRow = new TerminalVersioningRow();

  observationDateControl = new ObservationDateControl();

  visit(privateCode: string) {
    cy.visit(`/stop-registry/terminals/${privateCode}`);
  }

  page() {
    return cy.getByTestId('TerminalDetailsPage::page');
  }

  validityPeriod() {
    return cy.getByTestId('TerminalVersioningRow::validityPeriod');
  }
}
