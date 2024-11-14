export enum ToastType {
  PRIMARY = 'primary-toast',
  SUCCESS = 'success-toast',
  WARNING = 'warning-toast',
  DANGER = 'danger-toast',
}

export class Toast {
  getToastByType(toastType: ToastType) {
    return cy.getByTestId(toastType);
  }

  getPrimaryToast() {
    return this.getToastByType(ToastType.PRIMARY);
  }

  getSuccessToast() {
    return this.getToastByType(ToastType.SUCCESS);
  }

  getDangerToast() {
    return this.getToastByType(ToastType.DANGER);
  }

  getWarningToast() {
    return this.getToastByType(ToastType.WARNING);
  }

  checkToastHasMessage(message: string, toastType: ToastType) {
    this.getToastByType(toastType).contains(message);
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

  expectToast(toastType: ToastType, message?: string) {
    // Find any toast
    cy.get('[data-test-element-type="toast"]')
      // And wait it to become fully visible
      .should('have.css', 'opacity', '1')
      // Then assert it is of a right type.
      .then((toast) => {
        // eslint-disable-next-line jest/valid-expect
        expect(toast).have.attr('data-testid', toastType);
      });

    if (message) {
      this.checkToastHasMessage(message, toastType);
    }
  }

  expectPrimaryToast(message?: string) {
    this.expectToast(ToastType.PRIMARY, message);
  }

  expectSuccessToast(message?: string) {
    this.expectToast(ToastType.SUCCESS, message);
  }

  expectDangerToast(message?: string) {
    this.expectToast(ToastType.DANGER, message);
  }

  expectWarningToast(message?: string) {
    this.expectToast(ToastType.WARNING, message);
  }
}
