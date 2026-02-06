import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';

export class StopAreaDetails {
  static edit = StopAreaDetailsEdit;

  static getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  static getName = () => cy.getByTestId('StopAreaDetails::name');

  static getNameSwe = () => cy.getByTestId('StopAreaDetails::nameSwe');

  static getPrivateCode = () => cy.getByTestId('StopAreaDetails::privateCode');

  static getParentTerminal = () =>
    cy.getByTestId('StopAreaDetails::parentTerminal');

  static getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  static getValidityPeriod = () =>
    cy.getByTestId('StopAreaDetails::validityPeriod');

  static getNoStopsText = () => cy.getByTestId('StopAreaDetails::noStopsText');
}
