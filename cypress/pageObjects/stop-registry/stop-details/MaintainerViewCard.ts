export class MaintainerViewCard {
  getName() {
    return cy.getByTestId(`MaintainerViewCard::name`);
  }

  getPhone() {
    return cy.getByTestId(`MaintainerViewCard::phone`);
  }

  getEmail() {
    return cy.getByTestId(`MaintainerViewCard::email`);
  }

  getNotSelectedPlaceholder() {
    return cy.getByTestId(`MaintainerViewCard::notSelectedPlaceholder`);
  }
}
