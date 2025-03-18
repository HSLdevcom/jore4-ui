import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';

export class StopAreaDetails {
  edit = new StopAreaDetailsEdit();

  getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  getName = () => cy.getByTestId('StopAreaDetails::name');

  getNameSwe = () => cy.getByTestId('StopAreaDetails::nameSwe');

  getNameLongFin = () => cy.getByTestId('StopAreaDetails::nameLongFin');

  getNameLongSwe = () => cy.getByTestId('StopAreaDetails::nameLongSwe');

  getAbbreviationFin = () => cy.getByTestId('StopAreaDetails::abbreviationFin');

  getAbbreviationSwe = () => cy.getByTestId('StopAreaDetails::abbreviationSwe');

  getPrivateCode = () => cy.getByTestId('StopAreaDetails::privateCode');

  getParentTerminal = () => cy.getByTestId('StopAreaDetails::parentTerminal');

  getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  getValidityPeriod = () => cy.getByTestId('StopAreaDetails::validityPeriod');
}
