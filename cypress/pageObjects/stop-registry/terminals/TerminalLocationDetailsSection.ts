import { TerminalLocationDetailsEdit } from './TerminalLocationDetailsEdit';
import { TerminalLocationDetailsViewCard } from './TerminalLocationDetailsViewCard';

export class TerminalLocationDetailsSection {
  static viewCard = TerminalLocationDetailsViewCard;

  static edit = TerminalLocationDetailsEdit;

  static getEditButton() {
    return cy.getByTestId('TerminalLocationDetailsSection::editButton');
  }

  static getSaveButton() {
    return cy.getByTestId('TerminalLocationDetailsSection::saveButton');
  }
}
