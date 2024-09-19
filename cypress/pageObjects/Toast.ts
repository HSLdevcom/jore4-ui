export class Toast {
  getPrimaryToast() {
    return cy.getByTestId('primary-toast');
  }

  getSuccessToast() {
    return cy.getByTestId('success-toast');
  }

  getDangerToast() {
    return cy.getByTestId('danger-toast');
  }

  getWarningToast() {
    return cy.getByTestId('warning-toast');
  }

  checkDangerToastHasMessage(message: string) {
    this.getDangerToast().contains(message);
  }

  checkSuccessToastHasMessage(message: string) {
    this.getSuccessToast().contains(message);
  }

  checkWarningToastHasMessage(message: string) {
    this.getWarningToast().contains(message);
  }

  expectSuccessToast(message?: string) {
    // Find any toast
    cy.get('[data-testElementType="toast"]')
      // And wait it to become fully visible
      .should('have.css', 'opacity', '1')
      // Then assert it is of a right type.
      .then((toast) => {
        // eslint-disable-next-line jest/valid-expect
        expect(toast).have.attr('data-testid', 'success-toast');
      });

    if (message) {
      this.checkSuccessToastHasMessage(message);
    }
  }
}
