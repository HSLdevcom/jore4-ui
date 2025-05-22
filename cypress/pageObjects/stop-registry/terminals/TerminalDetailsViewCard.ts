export class TerminalDetailsViewCard {
  getToggle = () => cy.getByTestId('TerminalDetailsSection::toggle');

  getContent = () => cy.getByTestId('TerminalDetailsSection::content');

  getPrivateCode = () => cy.getByTestId('TerminalDetailsViewCard::privateCode');

  getDescription = () => cy.getByTestId('TerminalDetailsViewCard::description');

  getNameFin = () => cy.getByTestId('TerminalDetailsViewCard::name');

  getNameSwe = () => cy.getByTestId('TerminalDetailsViewCard::nameSwe');

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

  getDeparturePlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::departurePlatforms');

  getArrivalPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::arrivalPlatforms');

  getLoadingPlatforms = () =>
    cy.getByTestId('TerminalDetailsViewCard::loadingPlatforms');

  getElectricCharging = () =>
    cy.getByTestId('TerminalDetailsViewCard::electricCharging');
}
