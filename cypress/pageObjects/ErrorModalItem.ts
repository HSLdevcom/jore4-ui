export class ErrorModalItem {
  getItem() {
    return cy.getByTestId('ErrorModalItem::modalItem');
  }

  getTitle() {
    return cy.getByTestId('ErrorModalItem::title');
  }

  getDescription() {
    return cy.getByTestId('ErrorModalItem::textContent');
  }

  getAdditionalDetails() {
    return cy.getByTestId('ErrorModalItem::additionalDetails');
  }
}
