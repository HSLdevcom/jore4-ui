import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class StopAreaDetailsEdit {
  validity = new ValidityPeriodForm();

  getPrivateCode = () => cy.getByTestId('StopAreaDetailsEdit::privateCode');

  getName = () => cy.getByTestId('StopAreaDetailsEdit::name');

  getNameSwe = () => cy.getByTestId('StopAreaDetailsEdit::nameSwe');

  getNameLongFin = () => cy.getByTestId('StopAreaDetailsEdit::nameLongFin');

  getNameLongSwe = () => cy.getByTestId('StopAreaDetailsEdit::nameLongSwe');

  getAbbreviationFin = () =>
    cy.getByTestId('StopAreaDetailsEdit::abbreviationFin');

  getAbbreviationSwe = () =>
    cy.getByTestId('StopAreaDetailsEdit::abbreviationSwe');

  getLatitude = () => cy.getByTestId('StopAreaDetailsEdit::latitude');

  getLongitude = () => cy.getByTestId('StopAreaDetailsEdit::longitude');

  getCancelButton = () => cy.getByTestId('StopAreaDetailsEdit::cancelButton');

  getSaveButton = () => cy.getByTestId('StopAreaDetailsEdit::saveButton');
}
