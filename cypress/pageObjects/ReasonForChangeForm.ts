export class ReasonForChangeForm {
  getReasonForChangeInput() {
    return cy.getByTestId('ReasonForChangeForm::reasonForChange');
  }

  characterLimitReached() {
    return cy.getByTestId('ReasonForChangeForm::characterLimitReached');
  }
}
