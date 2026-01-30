import { TerminalInfoSpotsForm } from './TerminalInfoSpotsForm';

export class TerminalInfoSpotsSection {
  static form = TerminalInfoSpotsForm;

  static getContainer = () =>
    cy.getByTestId('TerminalInfoSpotsSection::container');

  static getTitle = () => cy.getByTestId('TerminalInfoSpotsSection::title');

  static getAddNewButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::addNewInfoSpotButton');
  }

  static getCancelButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::cancelButton');
  }

  static getSaveButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::saveButton');
  }

  static getToggleButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::toggle');
  }
}
