export class ReasonForChangeForm {
  static getReasonForChangeInput() {
    return cy.getByTestId('ReasonForChangeForm::reasonForChange');
  }

  static characterLimitReached() {
    return cy.getByTestId('ReasonForChangeForm::characterLimitReached');
  }
}
