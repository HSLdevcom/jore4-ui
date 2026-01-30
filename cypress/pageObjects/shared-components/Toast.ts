export enum ToastType {
  PRIMARY = 'primary-toast',
  SUCCESS = 'success-toast',
  WARNING = 'warning-toast',
  DANGER = 'danger-toast',
}

export class Toast {
  static expectToast(
    toastType: ToastType,
    message: string = '',
    dismiss: boolean = true,
  ) {
    // Find any toast
    cy.get('[data-test-element-type="toast"]')
      // And wait it to become fully visible
      .should('have.css', 'opacity', '1')
      // Then assert it is of a right type.
      .then((toast) => {
        expect(toast).have.attr('data-testid', toastType);

        if (message) {
          expect(toast).to.contain(message);
        }

        if (dismiss) {
          toast.find('[data-testid="Toast::closeButton"]').trigger('click');
        }
      });
  }

  static expectMultipleToasts(
    messages: ReadonlyArray<{
      readonly type: ToastType;
      readonly message: string;
    }>,
  ) {
    messages.forEach(({ type, message }) => {
      cy.get(`[data-test-element-type="toast"][data-testid=${type}]`)
        // And wait it to become fully visible
        .should('have.css', 'opacity', '1')
        // Then assert it is of a right type.
        .should((toast) => {
          expect(toast).to.contain(message);
          return toast;
        })
        .then((toast) =>
          toast.find('[data-testid="Toast::closeButton"]').trigger('click'),
        );
    });
  }

  static expectPrimaryToast(message?: string, dismiss?: boolean) {
    Toast.expectToast(ToastType.PRIMARY, message, dismiss);
  }

  static expectSuccessToast(message?: string, dismiss?: boolean) {
    Toast.expectToast(ToastType.SUCCESS, message, dismiss);
  }

  static expectDangerToast(message?: string, dismiss?: boolean) {
    Toast.expectToast(ToastType.DANGER, message, dismiss);
  }

  static expectWarningToast(message?: string, dismiss?: boolean) {
    Toast.expectToast(ToastType.WARNING, message, dismiss);
  }

  static dismissAllToasts() {
    cy.getByTestId('Toast::closeButton').each((button) => {
      cy.wrap(button).click();
    });
    cy.getByTestId('Toast::closeButton').should('not.exist');
  }
}
