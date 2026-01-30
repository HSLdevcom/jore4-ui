export class AlternativeNamesEdit {
  static getNameEng = () => cy.getByTestId('AlternativeNamesEdit::nameEng');

  static getNameLongFin = () =>
    cy.getByTestId('AlternativeNamesEdit::nameLongFin');

  static getNameLongSwe = () =>
    cy.getByTestId('AlternativeNamesEdit::nameLongSwe');

  static getNameLongEng = () =>
    cy.getByTestId('AlternativeNamesEdit::nameLongEng');

  static getAbbreviationFin = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationFin');

  static getAbbreviationSwe = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationSwe');

  static getAbbreviationEng = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationEng');
}
