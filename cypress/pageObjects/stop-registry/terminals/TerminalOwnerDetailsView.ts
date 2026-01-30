export class TerminalOwnerDetailsView {
  static getContainer = () => cy.getByTestId('OwnerDetailsViewCard::container');

  static getName = () => cy.getByTestId('OwnerDetailsViewCard::name');

  static getPhone = () => cy.getByTestId('OwnerDetailsViewCard::phone');

  static getEmail = () => cy.getByTestId('OwnerDetailsViewCard::email');

  static getContractId = () =>
    cy.getByTestId('OwnerDetailsViewCard::contractId');

  static getNote = () => cy.getByTestId('OwnerDetailsViewCard::note');

  static getNotSelectedPlaceholder = () =>
    cy.getByTestId('OwnerDetailsViewCard::notSelectedPlaceholder');
}
