import { TerminalLocationDetailsEdit } from './TerminalLocationDetailsEdit';
import { TerminalLocationDetailsViewCard } from './TerminalLocationDetailsViewCard';

export class TerminalLocationDetailsSection {
  viewCard = new TerminalLocationDetailsViewCard();

  edit = new TerminalLocationDetailsEdit();

  getEditButton() {
    return cy.getByTestId('TerminalLocationDetailsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('TerminalLocationDetailsSection::saveButton');
  }
}
