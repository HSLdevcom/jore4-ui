import { TerminalDetailsViewCard } from './TerminalDetailsViewCard';

export class TerminalDetailsSection {
  viewCard = new TerminalDetailsViewCard();

  getEditButton = () => cy.getByTestId('TerminalDetailsSection::editButton');

  getSaveButton = () => cy.getByTestId('TerminalDetailsSection::saveButton');
}
