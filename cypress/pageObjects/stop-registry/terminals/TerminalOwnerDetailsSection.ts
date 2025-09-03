import { OwnerDetailsEdit } from './OwnerDetailsEdit';
import { TerminalOwnerDetailsView } from './TerminalOwnerDetailsView';

export class TerminalOwnerDetailsSection {
  view = new TerminalOwnerDetailsView();

  edit = new OwnerDetailsEdit();

  getEditButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::editButton');

  getSaveButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::saveButton');

  getCancelButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::editButton');
}
