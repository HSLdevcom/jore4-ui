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

  checkViaInformationSubmitSuccess() {
    this.getSuccessToast().contains('Via-tieto asetettu').should('be.visible');
  }

  checkViaInformationRemoveSuccess() {
    this.getSuccessToast().contains('Via-tieto poistettu').should('be.visible');
  }

  checkAtLeastTwoStopsOnRouteErrorMessage() {
    this.getDangerToast().contains(
      'Error: Reitillä on oltava ainakin kaksi pysäkkiä.',
    );
  }
}
