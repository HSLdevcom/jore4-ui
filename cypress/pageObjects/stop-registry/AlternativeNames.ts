export class AlternativeNames {
  static getNameEng = () => cy.getByTestId('AlternativeNames::nameEng');

  static getNameLongFin = () => cy.getByTestId('AlternativeNames::nameLongFin');

  static getNameLongSwe = () => cy.getByTestId('AlternativeNames::nameLongSwe');

  static getNameLongEng = () => cy.getByTestId('AlternativeNames::nameLongEng');

  static getAbbreviationFin = () =>
    cy.getByTestId('AlternativeNames::abbreviationFin');

  static getAbbreviationSwe = () =>
    cy.getByTestId('AlternativeNames::abbreviationSwe');

  static getAbbreviationEng = () =>
    cy.getByTestId('AlternativeNames::abbreviationEng');
}
