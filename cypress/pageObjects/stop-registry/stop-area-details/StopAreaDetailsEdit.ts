import { ValidityPeriodForm } from '../../forms/ValidityPeriodForm';

export class StopAreaDetailsEdit {
  static validity = ValidityPeriodForm;

  static getPrivateCode = () =>
    cy.getByTestId('StopAreaDetailsEdit::privateCode');

  static getName = () => cy.getByTestId('StopAreaDetailsEdit::name');

  static getNameSwe = () => cy.getByTestId('StopAreaDetailsEdit::nameSwe');

  static getLatitude = () => cy.getByTestId('StopAreaDetailsEdit::latitude');

  static getLongitude = () => cy.getByTestId('StopAreaDetailsEdit::longitude');

  static getCancelButton = () =>
    cy.getByTestId('StopAreaDetailsEdit::cancelButton');

  static getSaveButton = () =>
    cy.getByTestId('StopAreaDetailsEdit::saveButton');
}
