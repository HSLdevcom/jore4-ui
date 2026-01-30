import { TerminalDetailsEdit } from './TerminalDetailsEdit';
import { TerminalDetailsViewCard } from './TerminalDetailsViewCard';

export class TerminalDetailsSection {
  static viewCard = TerminalDetailsViewCard;

  static edit = TerminalDetailsEdit;

  static getEditButton = () =>
    cy.getByTestId('TerminalDetailsSection::editButton');

  static getSaveButton = () =>
    cy.getByTestId('TerminalDetailsSection::saveButton');
}
