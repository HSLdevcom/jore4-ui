import { TerminalDetailsEdit } from './TerminalDetailsEdit';
import { TerminalDetailsViewCard } from './TerminalDetailsViewCard';

export class TerminalDetailsSection {
  viewCard = new TerminalDetailsViewCard();

  edit = new TerminalDetailsEdit();

  getEditButton = () => cy.getByTestId('TerminalDetailsSection::editButton');

  getSaveButton = () => cy.getByTestId('TerminalDetailsSection::saveButton');
}
