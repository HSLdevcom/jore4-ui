import { TerminalAddStopsModal } from './terminals';

export class TerminalDetailsStopsPage {
  static addStopsModal = TerminalAddStopsModal;

  static getTitle() {
    return cy.getByTestId('TerminalDetailsPage::stopsTitle');
  }

  static getStopAreas() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaSection');
  }

  static getNthStopArea(index: number) {
    return TerminalDetailsStopsPage.getStopAreas().eq(index);
  }

  static getStopAreaHeader() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaHeader');
  }

  static getStopAreaStopsTable() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaStopsTable');
  }

  static getAddStopToTerminalButton() {
    return cy.getByTestId('TerminalDetailsPage::addStopToTerminalButton');
  }
}
