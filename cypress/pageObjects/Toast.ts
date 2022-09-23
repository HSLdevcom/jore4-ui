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

  checkLineSubmitSuccess() {
    this.getSuccessToast().contains('Linja tallennettu');
  }

  checkRouteSubmitSuccess() {
    this.getSuccessToast().contains('Reitti tallennettu');
  }

  checkStopSubmitSuccess() {
    this.getSuccessToast().contains('Pysäkki luotu');
  }

  checkRouteSubmitFailure() {
    this.getDangerToast().contains('Tallennus epäonnistui');
  }
}
