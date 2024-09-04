import { SelectMemberStopsDropdown } from './SelectMemberStopsDropdown';
import { ValidityPeriodForm } from './ValidityPeriodForm';

export class StopAreaForm {
  validityPeriodForm = new ValidityPeriodForm();

  selectMemberStopsDropdown = new SelectMemberStopsDropdown();

  getForm() {
    return cy.getByTestId('StopAreaFormComponent::form');
  }

  getLabel() {
    return cy.getByTestId('StopAreaFormComponent::label');
  }

  getName() {
    return cy.getByTestId('StopAreaFormComponent::name');
  }

  getLatitude() {
    return cy.getByTestId('StopAreaFormComponent::latitude');
  }

  getLongitude() {
    return cy.getByTestId('StopAreaFormComponent::longitude');
  }

  /** Clicks the EditStopAreaModal's save button. Can be given forceAction = true
   * to force the click without waiting for it's actionability (If it's covered
   * by another element etc.).
   * https://docs.cypress.io/api/commands/click#Arguments
   */
  save(forceAction = false) {
    return cy
      .getByTestId('EditStopAreaModal')
      .findByTestId('Modal::saveButton')
      .click({ force: forceAction });
  }
}
