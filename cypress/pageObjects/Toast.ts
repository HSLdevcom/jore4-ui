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
    this.getSuccessToast().contains('Linja tallennettu').should('be.visible');
  }

  checkRouteSubmitSuccess() {
    this.getSuccessToast().contains('Reitti tallennettu').should('be.visible');
  }

  checkStopSubmitSuccess() {
    this.getSuccessToast().contains('Pysäkki luotu').should('be.visible');
  }
}
