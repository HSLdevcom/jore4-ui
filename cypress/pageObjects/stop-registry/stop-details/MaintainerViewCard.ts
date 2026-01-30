export class MaintainerViewCard {
  static getName() {
    return cy.getByTestId(`MaintainerViewCard::name`);
  }

  static getPhone() {
    return cy.getByTestId(`MaintainerViewCard::phone`);
  }

  static getEmail() {
    return cy.getByTestId(`MaintainerViewCard::email`);
  }

  static getNotSelectedPlaceholder() {
    return cy.getByTestId(`MaintainerViewCard::notSelectedPlaceholder`);
  }
}
