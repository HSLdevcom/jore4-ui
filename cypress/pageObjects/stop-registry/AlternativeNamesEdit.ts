export class AlternativeNamesEdit {
  getNameEng = () => cy.getByTestId('AlternativeNamesEdit::nameEng');

  getNameLongFin = () => cy.getByTestId('AlternativeNamesEdit::nameLongFin');

  getNameLongSwe = () => cy.getByTestId('AlternativeNamesEdit::nameLongSwe');

  getNameLongEng = () => cy.getByTestId('AlternativeNamesEdit::nameLongEng');

  getAbbreviationFin = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationFin');

  getAbbreviationSwe = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationSwe');

  getAbbreviationEng = () =>
    cy.getByTestId('AlternativeNamesEdit::abbreviationEng');
}
