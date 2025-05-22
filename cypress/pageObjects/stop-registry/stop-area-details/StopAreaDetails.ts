import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';

export class StopAreaDetails {
  edit = new StopAreaDetailsEdit();

  getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  getName = () => cy.getByTestId('StopAreaDetails::name');

  getNameSwe = () => cy.getByTestId('StopAreaDetails::nameSwe');

  getPrivateCode = () => cy.getByTestId('StopAreaDetails::privateCode');

  getParentTerminal = () => cy.getByTestId('StopAreaDetails::parentTerminal');

  getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  getValidityPeriod = () => cy.getByTestId('StopAreaDetails::validityPeriod');
}
