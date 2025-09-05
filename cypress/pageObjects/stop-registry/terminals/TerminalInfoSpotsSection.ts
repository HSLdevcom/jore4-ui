import { TerminalInfoSpotsForm } from './TerminalInfoSpotsForm';

export class TerminalInfoSpotsSection {
  form = new TerminalInfoSpotsForm();

  getContainer = () => cy.getByTestId('TerminalInfoSpotsSection::container');

  getTitle = () => cy.getByTestId('TerminalInfoSpotsSection::title');

  getAddNewButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::addNewInfoSpotButton');
  }

  getCancelButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::cancelButton');
  }

  getSaveButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::saveButton');
  }

  getToggleButton() {
    return cy.getByTestId('TerminalInfoSpotsSection::toggle');
  }
}
