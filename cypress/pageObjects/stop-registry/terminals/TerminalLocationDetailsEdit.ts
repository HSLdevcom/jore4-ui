export class TerminalLocationDetailsEdit {
  getStreetAddress = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::streetAddress');

  getPostalCode = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::postalCode');

  getMunicipality = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::municipality');

  getFareZone = () => cy.getByTestId('TerminalLocationDetailsEdit::fareZone');

  getLatitude = () => cy.getByTestId('TerminalLocationDetailsEdit::latitude');

  getLongitude = () => cy.getByTestId('TerminalLocationDetailsEdit::longitude');

  getSelectMemberStops = () =>
    cy.getByTestId('TerminalLocationDetailsEdit::memberStops');
}
