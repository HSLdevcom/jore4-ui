export class NavigationBlockedDialog {
  getCloseButton = () => cy.getByTestId('NavigationBlockedDialog::closeButton');

  getTitle = () => cy.getByTestId('NavigationBlockedDialog::title');

  getBody = () => cy.getByTestId('NavigationBlockedDialog::body');

  getProceedButton = () =>
    cy.getByTestId('NavigationBlockedDialog::proceedButton');

  getResetButton = () => cy.getByTestId('NavigationBlockedDialog::resetButton');
}
