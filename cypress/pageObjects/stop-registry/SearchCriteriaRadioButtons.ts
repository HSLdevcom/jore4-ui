export class SearchCriteriaRadioButtons {
  getAddressRadioButton() {
    return cy.getByTestId('SearchCriteriaRadioButtons::address');
  }

  getLabelRadioButton() {
    return cy.getByTestId('SearchCriteriaRadioButtons::labelOrName');
  }

  getLineRadioButton() {
    return cy.getByTestId('SearchCriteriaRadioButtons::line');
  }
}
