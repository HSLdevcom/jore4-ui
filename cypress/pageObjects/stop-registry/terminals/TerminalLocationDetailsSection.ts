import { TerminalLocationDetailsViewCard } from './TerminalLocationDetailsViewCard';

export class TerminalLocationDetailsSection {
  viewCard = new TerminalLocationDetailsViewCard();

  getEditButton() {
    return cy.getByTestId('LocationDetailsSection::editButton');
  }

  getSaveButton() {
    return cy.getByTestId('LocationDetailsSection::saveButton');
  }
}
