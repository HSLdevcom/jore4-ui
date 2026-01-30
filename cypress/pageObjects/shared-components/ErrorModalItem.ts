export class ErrorModalItem {
  static getItem() {
    return cy.getByTestId('ErrorModalItem::modalItem');
  }

  static getTitle() {
    return cy.getByTestId('ErrorModalItem::title');
  }

  static getDescription() {
    return cy.getByTestId('ErrorModalItem::textContent');
  }

  static getAdditionalDetails() {
    return cy.getByTestId('ErrorModalItem::additionalDetails');
  }
}
