import { OwnerDetailsEdit } from './OwnerDetailsEdit';
import { TerminalOwnerDetailsView } from './TerminalOwnerDetailsView';

export class TerminalOwnerDetailsSection {
  static view = TerminalOwnerDetailsView;

  static edit = OwnerDetailsEdit;

  static getEditButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::editButton');

  static getSaveButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::saveButton');

  static getCancelButton = () =>
    cy.getByTestId('TerminalOwnerDetailsSection::editButton');
}
