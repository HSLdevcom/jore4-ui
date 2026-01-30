export class NavigationBlockedDialog {
  static getCloseButton = () =>
    cy.getByTestId('NavigationBlockedDialog::closeButton');

  static getTitle = () => cy.getByTestId('NavigationBlockedDialog::title');

  static getBody = () => cy.getByTestId('NavigationBlockedDialog::body');

  static getProceedButton = () =>
    cy.getByTestId('NavigationBlockedDialog::proceedButton');

  static getResetButton = () =>
    cy.getByTestId('NavigationBlockedDialog::resetButton');
}
