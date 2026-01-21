export enum ToastType {
  PRIMARY = 'primary-toast',
  SUCCESS = 'success-toast',
  WARNING = 'warning-toast',
  DANGER = 'danger-toast',
}

export class Toast {
  expectToast(
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

  expectMultipleToasts(
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

  expectPrimaryToast(message?: string, dismiss?: boolean) {
    this.expectToast(ToastType.PRIMARY, message, dismiss);
  }

  expectSuccessToast(message?: string, dismiss?: boolean) {
    this.expectToast(ToastType.SUCCESS, message, dismiss);
  }

  expectDangerToast(message?: string, dismiss?: boolean) {
    this.expectToast(ToastType.DANGER, message, dismiss);
  }

  expectWarningToast(message?: string, dismiss?: boolean) {
    this.expectToast(ToastType.WARNING, message, dismiss);
  }

  dismissAllToasts() {
    cy.getByTestId('Toast::closeButton').each((button) => {
      cy.wrap(button).click();
    });
    cy.getByTestId('Toast::closeButton').should('not.exist');
  }
}
