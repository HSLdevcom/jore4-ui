export class TerminalOwnerDetailsView {
  getContainer = () => cy.getByTestId('OwnerDetailsViewCard::container');

  getName = () => cy.getByTestId('OwnerDetailsViewCard::name');

  getPhone = () => cy.getByTestId('OwnerDetailsViewCard::phone');

  getEmail = () => cy.getByTestId('OwnerDetailsViewCard::email');

  getContractId = () => cy.getByTestId('OwnerDetailsViewCard::contractId');

  getNote = () => cy.getByTestId('OwnerDetailsViewCard::note');

  getNotSelectedPlaceholder = () =>
    cy.getByTestId('OwnerDetailsViewCard::notSelectedPlaceholder');
}
