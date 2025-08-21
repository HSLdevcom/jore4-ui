import { TerminalAddStopsModal } from './terminals';

export class TerminalDetailsStopsPage {
  addStopsModal = new TerminalAddStopsModal();

  getTitle() {
    return cy.getByTestId('TerminalDetailsPage::stopsTitle');
  }

  getStopAreas() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaSection');
  }

  getNthStopArea(index: number) {
    return this.getStopAreas().eq(index);
  }

  getStopAreaHeader() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaHeader');
  }

  getStopAreaStopsTable() {
    return cy.getByTestId('TerminalDetailsPage::stopAreaStopsTable');
  }

  getAddStopToTerminalButton() {
    return cy.getByTestId('TerminalDetailsPage::addStopToTerminalButton');
  }
}
