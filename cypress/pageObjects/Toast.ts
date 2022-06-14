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
}
