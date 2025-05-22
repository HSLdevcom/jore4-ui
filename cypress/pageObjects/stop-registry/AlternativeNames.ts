export class AlternativeNames {
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
}
