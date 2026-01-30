export class TerminalLocationDetailsEdit {
  static getStreetAddress = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::streetAddress');

  static getPostalCode = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::postalCode');

  static getMunicipality = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::municipality');

  static getFareZone = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::fareZone');

  static getLatitude = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::latitude');

  static getLongitude = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::longitude');

  static getSelectMemberStops = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::memberStops');
}
