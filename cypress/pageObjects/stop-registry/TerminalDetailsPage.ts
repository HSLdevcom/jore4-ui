import { ObservationDateControl } from '../ObservationDateControl';
import {
  EditTerminalValidityModal,
  TerminalDetailsSection,
  TerminalLocationDetailsSection,
  TerminalTitleRow,
  TerminalVersioningRow,
} from './terminals';

export class TerminalDetailsPage {
  terminalDetails = new TerminalDetailsSection();

  locationDetails = new TerminalLocationDetailsSection();

  titleRow = new TerminalTitleRow();

  versioningRow = new TerminalVersioningRow();

  observationDateControl = new ObservationDateControl();

  editTerminalValidityModal = new EditTerminalValidityModal();

  visit(privateCode: string) {
    cy.visit(`/stop-registry/terminals/${privateCode}`);
  }

  page() {
    return cy.getByTestId('TerminalDetailsPage::page');
  }

  validityPeriod() {
    return cy.getByTestId('TerminalVersioningRow::validityPeriod');
  }

  getTabSelector() {
    return {
      getStopsTab: () => cy.getByTestId('TerminalDetailsPage::stopsTabButton'),
      getBasicDetailsTab: () =>
        cy.getByTestId('TerminalDetailsPage::basicDetailsTabButton'),
    };
  }

  getStopsSection() {
    return {
      getTitle: () => cy.getByTestId('TerminalDetailsPage::stopsTitle'),
      getStopAreas: () =>
        cy.getByTestId('TerminalDetailsPage::stopAreaSection'),
      getNthStopArea(index: number) {
        return this.getStopAreas().eq(index);
      },
      getStopAreaHeader: () =>
        cy.getByTestId('TerminalDetailsPage::stopAreaHeader'),
      getStopAreaStopsTable: () =>
        cy.getByTestId('TerminalDetailsPage::stopAreaStopsTable'),
    };
  }
}
