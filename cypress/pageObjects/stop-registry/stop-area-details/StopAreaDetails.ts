import { StopAreaDetailsEdit } from './StopAreaDetailsEdit';

export class StopAreaDetails {
  edit = new StopAreaDetailsEdit();

  getEditButton = () => cy.getByTestId('StopAreaDetails::editButton');

  getName = () => cy.getByTestId('StopAreaDetails::name');

  getNameSwe = () => cy.getByTestId('StopAreaDetails::nameSwe');

  getNameEng = () => cy.getByTestId('AlternativeNames::nameEng');

  getNameLongFin = () => cy.getByTestId('AlternativeNames::nameLongFin');

  getNameLongSwe = () => cy.getByTestId('AlternativeNames::nameLongSwe');

  getNameLongEng = () => cy.getByTestId('AlternativeNames::nameLongEng');

  getAbbreviationFin = () =>
    cy.getByTestId('AlternativeNames::abbreviationFin');

  getAbbreviationSwe = () =>
    cy.getByTestId('AlternativeNames::abbreviationSwe');

  getAbbreviationEng = () =>
    cy.getByTestId('AlternativeNames::abbreviationEng');

  getPrivateCode = () => cy.getByTestId('StopAreaDetails::privateCode');

  getParentTerminal = () => cy.getByTestId('StopAreaDetails::parentTerminal');

  getAreaSize = () => cy.getByTestId('StopAreaDetails::areaSize');

  getValidityPeriod = () => cy.getByTestId('StopAreaDetails::validityPeriod');
}
