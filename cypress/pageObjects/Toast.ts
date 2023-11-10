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
}
