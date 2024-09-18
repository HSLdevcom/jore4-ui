import { ValidityPeriodForm } from '../../ValidityPeriodForm';

export class StopAreaDetailsEdit {
  validity = new ValidityPeriodForm();

  getLabel = () => cy.getByTestId('StopAreaDetailsEdit::label');

  getName = () => cy.getByTestId('StopAreaDetailsEdit::name');

  getLatitude = () => cy.getByTestId('StopAreaDetailsEdit::latitude');

  getLongitude = () => cy.getByTestId('StopAreaDetailsEdit::longitude');

  getCancelButton = () => cy.getByTestId('StopAreaDetailsEdit::cancelButton');

  getSaveButton = () => cy.getByTestId('StopAreaDetailsEdit::saveButton');
}
