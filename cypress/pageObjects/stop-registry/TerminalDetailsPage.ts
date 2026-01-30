import { ObservationDateControl } from '../timetables/ObservationDateControl';
import { TerminalDetailsStopsPage } from './TerminalDetailsStopsPage';
import {
  EditTerminalValidityModal,
  TerminalDetailsSection,
  TerminalInfoSpotsSection,
  TerminalLocationDetailsSection,
  TerminalOwnerDetailsSection,
  TerminalTitleRow,
  TerminalVersioningRow,
} from './terminals';

export class TerminalDetailsPage {
  static terminalDetails = TerminalDetailsSection;

  static locationDetails = TerminalLocationDetailsSection;

  static infoSpots = TerminalInfoSpotsSection;

  static titleRow = TerminalTitleRow;

  static versioningRow = TerminalVersioningRow;

  static observationDateControl = ObservationDateControl;

  static editTerminalValidityModal = EditTerminalValidityModal;

  static stopsPage = TerminalDetailsStopsPage;

  static owner = TerminalOwnerDetailsSection;

  static visit(privateCode: string, observationDate?: string) {
    cy.visit(
      `/stop-registry/terminals/${privateCode}${observationDate ? `?observationDate=${observationDate}` : ''}`,
    );
  }

  static page() {
    return cy.getByTestId('TerminalDetailsPage::page');
  }

  static validityPeriod() {
    return cy.getByTestId('TerminalVersioningRow::validityPeriod');
  }

  static getTabSelector() {
    return {
      getStopsTab: () => cy.getByTestId('TerminalDetailsPage::stopsTabButton'),
      getBasicDetailsTab: () =>
        cy.getByTestId('TerminalDetailsPage::basicDetailsTabButton'),
      getInfoSpotsTab: () =>
        cy.getByTestId('TerminalDetailsPage::infoSpotsTabButton'),
    };
  }
}
